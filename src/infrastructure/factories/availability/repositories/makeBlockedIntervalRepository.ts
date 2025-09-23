import type {
  BlockedIntervalRepository
} from '@application/ports/repositories/BlockedIntervalRepository';
import { makeDb } from '@infrastructure/database/drizzle/connection';
import {
  BlockedIntervalDrizzleRepository
} from '@infrastructure/database/drizzle/repositories/BlockedIntervalRepository';

export function makeBlockedIntervalRepository(): BlockedIntervalRepository {
  return new BlockedIntervalDrizzleRepository(makeDb());
}