import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded } from 'express';
import globalErrorHandler from './app/middlewares/globalErrrorHandler';
import notFound from './app/middlewares/not-found';
import router from './app/routes';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://medic-panda.vercel.app',
      'https://medic-panda-bkpopvgwo-sujoykumardas-projects.vercel.app',
    ],
    credentials: true,
  }),
);

// Parsers
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use(router);

// Middlewares
app.use(globalErrorHandler);

// 404 Not found middleware
app.use(notFound);

export default app;
