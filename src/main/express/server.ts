import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { router } from './routes/router';
import { env } from '../../config/env';
import { HandleApplicationErrorMiddleware } from '../../application/shared/http/middlewares/HandleApplicationErrorMiddleware';
import { errorMiddlewareAdapter } from './adapters/errorMiddlewareAdapter';

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: env.CORS ?? '*', 
  credentials: true 
}));
app.use(express.json());
app.use(pinoHttp());
app.use(router);
app.use(errorMiddlewareAdapter(new HandleApplicationErrorMiddleware()));

export { app };
