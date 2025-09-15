import type { RoleCode } from "../domain/entities/Role";

declare global {
  namespace Express {
    interface Request {
      metadata?: {
        account?: {
          id: string;
          role: RoleCode;
        };
      };
    }
  }
}

export {}; // garante que este .d.ts é um módulo
