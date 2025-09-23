import { Router } from 'express';
import { routeAdapter } from '../adapters/routeAdapter';
import { makeGetDailyAvailabilityController } from '@infrastructure/factories/availability/makeGetDailyAvailabilityController';

export const availabilityRouter = Router();

availabilityRouter.get('/', routeAdapter(makeGetDailyAvailabilityController()));