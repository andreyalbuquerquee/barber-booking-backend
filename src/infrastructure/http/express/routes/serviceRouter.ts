import { Router } from 'express';
import { routeAdapter } from '../adapters/routeAdapter.js';
import { makeListServicesController } from '../../../factories/service/makeListServicesController';

export const serviceRouter = Router();

serviceRouter.get('/', routeAdapter(makeListServicesController()));