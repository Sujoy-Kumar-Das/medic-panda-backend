import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import AppError from './app/errors/AppError';

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log('Database connected successfully.');
    app.listen(config.port, () => {
      console.log(`medic panda app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
    throw new AppError(404, 'Server error.');
  }
}

main();
