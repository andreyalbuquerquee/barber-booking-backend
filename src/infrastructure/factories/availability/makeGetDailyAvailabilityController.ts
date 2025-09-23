import type { Controller } from 'interfaces/http/protocols/Controller';
import { makeGetDailyAvailabilityUseCase } from './makeGetDailyAvailabilityUseCase';
import { GetDailyAvailabilityController } from 'interfaces/http/controllers/GetDailyAvailabilityController';

export function makeGetDailyAvailabilityController(): Controller {
  return new GetDailyAvailabilityController(makeGetDailyAvailabilityUseCase());
}