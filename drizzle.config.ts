import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/infrastructure/database/drizzle/schema.ts',
  dbCredentials: { 
    url: env.DATABASE_URL
  },
  out: './src/infrastructure/database/drizzle/migrations',
});
