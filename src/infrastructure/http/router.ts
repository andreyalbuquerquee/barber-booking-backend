import { Router } from 'express';
const r = Router();

r.get('/healthcheck', async (req, res) => { 
  res.send({ ok: true }).status(201);
 });

r.get('/services', async (req, res) => { /* listar serviços */ });

r.get('/availability', async (req, res) => { /* gerar slots por dia */ });

r.post('/appointments', async (req, res) => {
  // chamar caso de uso → 201 ou 409 se colisão
});

r.patch('/appointments/:id', async (req, res) => {
  // confirmar/cancelar/completar
});

export const router = r;