import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const logLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL é obrigatório'),

  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET deve ter pelo menos 16 caracteres'),

  CORS_ORIGIN: z.string().optional(),

  LOG_LEVEL: z.enum(logLevels).default('info'),
});

type Env = z.infer<typeof EnvSchema>;

function parseCors(origin?: string): string[] | '*' | undefined {
  if (!origin) return undefined;
  if (origin.trim() === '*') return '*';
  return origin
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Erro ao validar variáveis de ambiente:');
  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

const baseEnv: Env = parsed.data;

export const env = {
  ...baseEnv,
  CORS: parseCors(baseEnv.CORS_ORIGIN),
} as const;
