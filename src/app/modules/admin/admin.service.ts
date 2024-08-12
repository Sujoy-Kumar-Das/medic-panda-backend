import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { IUser } from '../user/user.interface';
import { userModel } from '../user/user.model';
import { IAdmin } from './admin.interface';
import { adminModel } from './admin.model';

const createAdminService = async (payload: IAdmin) => {
  const { email, password, name, photo } = payload;

  // check is the user already exists
  const isUserExists = await userModel.isUserExists(email);

  if (isUserExists) {
    throw new AppError(403, `${name} already have an account.`);
  }

  // create a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    const userData: IUser = {
      email,
      password,
      role: 'admin',
    };

    // create the user
    const createUser = await userModel.create([userData], { session });

    if (!createUser.length) {
      throw new AppError(400, 'Flailed to create admin.');
    }

    const adminData = {
      userId: createUser[0]._id,
      name,
      photo,
    };

    const createAdmin = await adminModel.create([adminData], {
      session,
    });

    if (!createAdmin.length) {
      throw new AppError(400, 'Failed to create admin.');
    }

    await session.commitTransaction();
    await session.endSession();

    return createAdmin[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
    throw new AppError(
      400,
      'Something went wrong for create admin. Please try again.',
    );
  }
};

export const adminService = {
  createAdminService,
};
