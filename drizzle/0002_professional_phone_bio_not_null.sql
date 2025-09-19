-- 0002_professional_phone_bio_not_null.sql
BEGIN;

-- backfill para evitar falha no SET NOT NULL
UPDATE professionals SET phone = '' WHERE phone IS NULL;
UPDATE professionals SET bio   = '' WHERE bio   IS NULL;

ALTER TABLE professionals
  ALTER COLUMN phone SET NOT NULL,
  ALTER COLUMN bio   SET NOT NULL;

COMMIT;
