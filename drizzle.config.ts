import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/infrastructure/database/schema.ts',
  dbCredentials: { url: env.DATABASE_URL || '' },
});
