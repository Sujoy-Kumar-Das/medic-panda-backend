import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { IUser } from '../user/user.interface';
import { userModel } from '../user/user.model';
import { ICustomer } from './customer.interface';
import { customerModel } from './customer.model';

const createCustomerService = async (payload: ICustomer) => {
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
      role: 'user',
    };

    // create the user
    const createUser = await userModel.create([userData], { session });

    if (!createUser.length) {
      throw new AppError(400, 'Flailed to create customer.');
    }

    const customerData = {
      userId: createUser[0]._id,
      name,
      photo,
    };

    const createCustomer = await customerModel.create([customerData], {
      session,
    });

    if (!createCustomer.length) {
      throw new AppError(400, 'Failed to create customer.');
    }

    await session.commitTransaction();
    await session.endSession();

    return createCustomer[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
    throw new AppError(
      400,
      'Something went wrong for create user. Please try again.',
    );
  }
};

export const customerService = {
  createCustomerService,
};
