import type {
  WorkingHourRepository
} from '@application/ports/repositories/WorkingHourRepository';
import { makeDb } from '@infrastructure/database/drizzle/connection';
import {
  WorkingHourDrizzleRepository
} from '@infrastructure/database/drizzle/repositories/WorkingHourDrizzleRepository';

export function makeWorkingHourRepository(): WorkingHourRepository {
  return new WorkingHourDrizzleRepository(makeDb());
}