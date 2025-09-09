CREATE EXTENSION IF NOT EXISTS pgcrypto;      -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS btree_gist;    -- para EXCLUDE + ranges

-- =============================
-- Tipos ENUM
-- =============================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('pending','confirmed','cancelled','completed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin','barber');
  END IF;
END $$;

-- =============================
-- Função de auditoria (updated_at)
-- =============================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

-- =============================
-- Tabela: users (autenticação)
-- =============================
CREATE TABLE IF NOT EXISTS users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  email           text NOT NULL UNIQUE,
  password_hash   text NOT NULL,
  role            user_role NOT NULL DEFAULT 'barber',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================
-- Tabela: professionals (barbeiros)
-- =============================
CREATE TABLE IF NOT EXISTS professionals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES users(id) ON DELETE SET NULL,
  full_name       text NOT NULL,
  slug            text NOT NULL UNIQUE,
  phone           text,
  bio             text,
  timezone        text NOT NULL DEFAULT 'America/Recife',
  active          boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_professionals_full_name_len CHECK (char_length(full_name) >= 2)
);
CREATE INDEX IF NOT EXISTS idx_professionals_active ON professionals(active);
CREATE TRIGGER trg_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================
-- Tabela: services (serviços da barbearia)
-- =============================
CREATE TABLE IF NOT EXISTS services (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  duration_minutes  integer NOT NULL,
  price_brl         numeric(10,2),                    -- opcional
  active            boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_services_name UNIQUE (name),
  CONSTRAINT chk_duration_positive CHECK (duration_minutes BETWEEN 5 AND 480),
  CONSTRAINT chk_duration_step CHECK (duration_minutes % 5 = 0),
  CONSTRAINT chk_price_nonneg CHECK (price_brl IS NULL OR price_brl >= 0)
);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- (Opcional avançado) Relação serviço↔profissional com preço diferenciado
-- Mantido simples: por padrão todos os profissionais executam todos os serviços.
-- Caso precise restringir/precificar por profissional no futuro, crie:
-- professional_services(professional_id, service_id, price_override_brl, active)

-- =============================
-- Tabela: working_hours (agenda semanal recorrente)
-- =============================
CREATE TABLE IF NOT EXISTS working_hours (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  weekday         smallint NOT NULL,                 -- 0=domingo ... 6=sábado
  start_time      time NOT NULL,                     -- horário local do profissional
  end_time        time NOT NULL,
  slot_step_min   integer NOT NULL DEFAULT 15,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_weekday_range CHECK (weekday BETWEEN 0 AND 6),
  CONSTRAINT chk_time_order CHECK (start_time < end_time),
  CONSTRAINT chk_slot_step_pos CHECK (slot_step_min IN (5,10,15,20,30,60)),
  CONSTRAINT uq_wh_prof_day UNIQUE (professional_id, weekday)
);
CREATE INDEX IF NOT EXISTS idx_wh_prof ON working_hours(professional_id);
CREATE TRIGGER trg_wh_updated_at
  BEFORE UPDATE ON working_hours
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================
-- Tabela: blocked_intervals (bloqueios pontuais)
-- =============================
CREATE TABLE IF NOT EXISTS blocked_intervals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL,
  reason          text,
  created_by      uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_block_range CHECK (starts_at < ends_at)
);
CREATE INDEX IF NOT EXISTS idx_block_prof_start ON blocked_intervals(professional_id, starts_at);
CREATE TRIGGER trg_block_updated_at
  BEFORE UPDATE ON blocked_intervals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================
-- Tabela: appointments (agendamentos)
-- =============================
CREATE TABLE IF NOT EXISTS appointments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id  uuid NOT NULL REFERENCES professionals(id) ON DELETE RESTRICT,
  service_id       uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  customer_name    text NOT NULL,
  customer_phone   text NOT NULL,
  customer_email   text,
  notes            text,
  status           appointment_status NOT NULL DEFAULT 'pending',
  starts_at        timestamptz NOT NULL,
  ends_at          timestamptz NOT NULL,
  source           text NOT NULL DEFAULT 'web',
  created_by       uuid REFERENCES users(id) ON DELETE SET NULL, -- quem criou (no painel)
  updated_by       uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_appt_time CHECK (starts_at < ends_at)
);

-- Índices comuns para consultas
CREATE INDEX IF NOT EXISTS idx_appt_prof_start ON appointments(professional_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_appt_status ON appointments(status);

-- Evitar overbooking: não permitir interseção de intervalos para o mesmo profissional quando
-- status ∈ {pending, confirmed}. Intervalo fechado-aberto: [starts_at, ends_at)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'appt_no_overlap'
  ) THEN
    ALTER TABLE appointments
      ADD CONSTRAINT appt_no_overlap
      EXCLUDE USING gist (
        professional_id WITH =,
        tstzrange(starts_at, ends_at, '[)') WITH &&
      )
      WHERE (status IN ('pending','confirmed'));
  END IF;
END$$;

CREATE TRIGGER trg_appt_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================
-- Views auxiliares (opcional)
-- =============================
-- Exemplo de view para inspeção rápida do calendário (não usada pela API diretamente)
CREATE OR REPLACE VIEW v_appointments_today AS
SELECT a.*, p.full_name AS professional_name, s.name AS service_name
FROM appointments a
JOIN professionals p ON p.id = a.professional_id
JOIN services s ON s.id = a.service_id
WHERE a.starts_at >= date_trunc('day', now())
  AND a.starts_at < date_trunc('day', now()) + interval '1 day';