import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded } from 'express';
import {
  startProductCron,
  stopProductCron,
} from './app/helpers/product-db-corn.job';
import globalErrorHandler from './app/middlewares/globalErrrorHandler';
import notFound from './app/middlewares/not-found';
import router from './app/routes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// Parsers
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use(router);

// Start cron job when application starts
startProductCron();

// Middlewares
app.use(globalErrorHandler);

// 404 Not found middleware
app.use(notFound);

// Graceful shutdown handler
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');

  // Stop the cron job
  stopProductCron();

  // Add other cleanup tasks here if needed
  process.exit(0);
};

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
