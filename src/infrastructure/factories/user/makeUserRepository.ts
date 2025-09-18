import type { UserRepository } from '../../../domain/repositories/UserRepository';
import { makeDb } from '../../../infrastructure/database/drizzle/connection';
import { UserDrizzleRepository } from '../../../infrastructure/database/drizzle/repositories/UserDrizzleRepository';

export function makeUserRepository(): UserRepository {
  return new UserDrizzleRepository(makeDb());
}