import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSupperAdmin from './app/DB';
import AppError from './app/errors/AppError';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    await seedSupperAdmin();
    console.log('Database connected successfully.');
    await mongoose.connect(config.db_url as string);
    server = app.listen(config.port, () => {
      console.log(` server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
    throw new AppError(404, 'Server error.');
  }
}

main();

process.on('unhandledRejection', () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  process.exit(1);
});
