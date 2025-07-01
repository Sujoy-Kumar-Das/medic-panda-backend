import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSupperAdmin from './app/DB';
import AppError from './app/errors/AppError';
import { startCronJobs, stopAllCronJobs } from './app/helpers/corn.jobs';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    await seedSupperAdmin();
    startCronJobs();
    console.log('Database connected successfully.');
    server = app.listen(config.port, () => {
      console.log(`server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
    throw new AppError(404, 'Server error.');
  }
}

main();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');

  try {
    stopAllCronJobs();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
