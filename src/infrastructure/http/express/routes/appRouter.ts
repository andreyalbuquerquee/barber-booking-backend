import { Router } from 'express';
import { authRouter } from './authRouter.js';
import { serviceRouter } from './serviceRouter.js';
import { professionalRouter } from './professionalRouter';
import { availabilityRouter } from './availabilityRouter';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/services', serviceRouter);
appRouter.use('/professionals', professionalRouter);
appRouter.use('/availability', availabilityRouter);

appRouter.get('/healthcheck', async (req, res) => { 
  res.send({ ok: true }).status(201);
 });

appRouter.post('/appointments', async (req, res) => {
  // chamar caso de uso → 201 ou 409 se colisão
});

appRouter.patch('/appointments/:id', async (req, res) => {
  // confirmar/cancelar/completar
});
