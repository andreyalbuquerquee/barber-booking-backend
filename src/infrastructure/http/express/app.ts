import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { appRouter } from './routes/appRouter';
import { env } from '../../../config/env';
import { HandleApplicationErrorMiddleware } from './middlewares/HandleApplicationErrorMiddleware';
import { errorMiddlewareAdapter } from './adapters/errorMiddlewareAdapter';

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: env.CORS ?? '*', 
  credentials: true 
}));
app.use(express.json());
app.use(pinoHttp());
app.use(appRouter);

app.use(errorMiddlewareAdapter(new HandleApplicationErrorMiddleware()));

export { app };
