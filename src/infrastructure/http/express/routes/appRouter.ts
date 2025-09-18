import { Router } from 'express';
import { authRouter } from './authRouter.js';
import { serviceRouter } from './serviceRouter.js';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/services', serviceRouter);

appRouter.get('/healthcheck', async (req, res) => { 
  res.send({ ok: true }).status(201);
 });

appRouter.get('/availability', async (req, res) => { /* gerar slots por dia */ });

appRouter.post('/appointments', async (req, res) => {
  // chamar caso de uso → 201 ou 409 se colisão
});

appRouter.patch('/appointments/:id', async (req, res) => {
  // confirmar/cancelar/completar
});
