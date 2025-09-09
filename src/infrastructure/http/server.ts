import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { router } from './router';
import { env } from '../../config/env';

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: env.CORS ?? [/localhost:5173$/], 
  credentials: true 
}));
app.use(express.json());
app.use(pinoHttp());
app.use(router);

export { app };