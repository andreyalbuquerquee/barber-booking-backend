import { Router } from 'express';
import { routeAdapter } from '../adapters/routeAdapter';
import { makeListActiveProfessionalsController } from '../../../factories/professional/makeListActiveProfessionalsController';

export const professionalRouter = Router();

professionalRouter.get('/', routeAdapter(makeListActiveProfessionalsController()));