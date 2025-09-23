import type {
  AppointmentRepository
} from '@application/ports/repositories/AppointmentRepository';
import { makeDb } from '@infrastructure/database/drizzle/connection';
import {
  AppointmentDrizzleRepository
} from '@infrastructure/database/drizzle/repositories/AppointmentDrizzleRepository';

export function makeAppointmentRepository(): AppointmentRepository {
  return new AppointmentDrizzleRepository(makeDb());
}