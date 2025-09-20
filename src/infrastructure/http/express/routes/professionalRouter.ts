import { Router } from 'express';
import { routeAdapter } from '../adapters/routeAdapter';
import {
  makeListActiveProfessionalsController
} from '@infrastructure/factories/professional/makeListActiveProfessionalsController';

export const professionalRouter = Router();

professionalRouter.get('/', routeAdapter(makeListActiveProfessionalsController()));