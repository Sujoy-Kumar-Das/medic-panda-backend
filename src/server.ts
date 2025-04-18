import { createServer } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSupperAdmin from './app/DB';
import AppError from './app/errors/AppError';
import { initializeSocket } from './app/socket/socket';

export const server = createServer(app);

// initialize socket
initializeSocket(server);

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    await seedSupperAdmin();
    console.log('Database connected successfully.');
    server.listen(config.port, () => {
      console.log(`medic panda app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
    throw new AppError(404, 'Server error.');
  }
}

main();
