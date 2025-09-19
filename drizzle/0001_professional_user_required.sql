-- 0001_professionals_user_required.sql
BEGIN;

-- 0) Guarda: não permitir seguir se houver profissionais sem user_id
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM professionals WHERE user_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot enforce 1:1: found professionals with NULL user_id';
  END IF;
END $$;

-- 1) Remover a FK antiga (era ON DELETE SET NULL)
ALTER TABLE professionals
  DROP CONSTRAINT IF EXISTS professionals_user_id_fkey;

-- 2) Tornar user_id obrigatório
ALTER TABLE professionals
  ALTER COLUMN user_id SET NOT NULL;

-- 3) Unicidade: garantir que um mesmo user_id não apareça em mais de um professional
-- (falha caso haja duplicatas; resolva antes criando/ajustando registros)
ALTER TABLE professionals
  ADD CONSTRAINT professionals_user_id_key UNIQUE (user_id);

-- 4) Recriar a FK como RESTRICT (impede deletar o usuário se houver profissional)
ALTER TABLE professionals
  ADD CONSTRAINT professionals_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE RESTRICT;

COMMIT;
