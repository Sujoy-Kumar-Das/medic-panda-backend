import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { IAdmin } from '../admin/admin.interface';
import { adminModel } from '../admin/admin.model';
import { ICustomer } from '../customer/customer.interface';
import { customerModel } from '../customer/customer.model';
import { IUser } from '../user/user.interface';
import { userModel } from '../user/user.model';

// create customer
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

    const userData = {
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

// create admin
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

export const userService = {
  createCustomerService,
  createAdminService,
};
