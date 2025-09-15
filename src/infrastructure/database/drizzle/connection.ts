import { Pool } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../../drizzle/schema';

let pool: Pool | null = null;
let dbSingleton: NodePgDatabase<typeof schema> | null = null;

export type DB = NodePgDatabase<typeof schema>;

export function makeDb(): DB {
  if (dbSingleton) return dbSingleton;

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  dbSingleton = drizzle(pool, { schema });
  
  return dbSingleton;
}

export async function closeDb() {
  await pool?.end();
  pool = null;
  dbSingleton = null;
}
