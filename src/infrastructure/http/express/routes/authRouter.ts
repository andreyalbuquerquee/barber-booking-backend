import { Router } from 'express';
import { routeAdapter } from '../adapters/routeAdapter';
import { makeSignInController } from '../../../factories/user/makeSignInController';

export const authRouter = Router();

authRouter.post('/sign-in', routeAdapter(makeSignInController()));