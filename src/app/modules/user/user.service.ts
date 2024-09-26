import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { IUserRoles } from '../../interface/user.roles.interface';
import { createToken } from '../../utils/createJwtToken';
import { sendEmail } from '../../utils/sendEmail';
import verifyToken from '../../utils/verifyJwtToken';
import { IAdmin } from '../admin/admin.interface';
import { adminModel } from '../admin/admin.model';
import { ICustomer } from '../customer/customer.interface';
import { customerModel } from '../customer/customer.model';
import { userModel } from '../user/user.model';
import { USER_ROLE } from './user.constant';

interface ICustomerPayload extends ICustomer {
  email: string;
  password: string;
}

interface IAdminPayload extends IAdmin {
  email: string;
  password: string;
}

// create customer
const createCustomerService = async (payload: ICustomerPayload) => {
  const { email, password, name, photo, contact } = payload;

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
      role: USER_ROLE.user,
    };

    // create the user
    const createUser = await userModel.create([userData], { session });

    if (!createUser.length) {
      throw new AppError(400, 'Flailed to create customer.');
    }

    const customerData = {
      user: createUser[0]._id,
      name,
      photo,
      contact: contact ? contact : null,
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
const createAdminService = async (payload: IAdminPayload) => {
  const { email, password, name, photo, contact } = payload;

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
      role: USER_ROLE.admin,
    };

    // create the user
    const createUser = await userModel.create([userData], { session });

    if (!createUser.length) {
      throw new AppError(400, 'Flailed to create admin.');
    }

    const adminData = {
      user: createUser[0]._id,
      name,
      photo,
      contact: contact ? contact : null,
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

const updateUserEmail = async (userId: string, payload: { email: string }) => {
  const { email } = payload;

  const isUserExistsByEmail = await userModel.findOne({ email });

  if (isUserExistsByEmail) {
    throw new AppError(401, 'This email already exists.');
  }

  const result = await userModel.findByIdAndUpdate(
    userId,
    { email, isVerified: false },
    { new: true },
  );

  return result;
};

// get me
const getMeService = async (id: string, role: IUserRoles) => {
  const user = await userModel.findOne({ _id: id, role });

  if (!user) {
    throw new AppError(404, 'This user not found.');
  }

  if (user.isDeleted) {
    throw new AppError(404, 'This user has been deleted.');
  }

  if (user.isBlocked) {
    throw new AppError(404, 'This user has been blocked.');
  }

  if (user.role === USER_ROLE.user) {
    return await customerModel.findOne({ user: user._id }).populate('user');
  }

  if (user.role === USER_ROLE.admin) {
    return await adminModel.findOne({ user: user._id }).populate('user');
  }

  if (user.role === USER_ROLE.superAdmin) {
    return await adminModel.findOne({ user: user._id }).populate('user');
  }
};

// get all users
const getAllUsers = async () => {
  const customer = await customerModel.find().populate('user');
  const admin = await adminModel.find().populate('user');

  console.log({ customer, admin });
  return [...customer, ...admin];
};

// get single users
const getSingleUser = async (id: string, role: string) => {
  if (role === USER_ROLE.user) {
    return await customerModel.findOne({ user: id, role }).populate('user');
  }

  if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    return await adminModel.findOne({ user: id }).populate('user');
  }
};

// get all block users
const getAllBlockedUsers = async () => {
  const customer = await customerModel
    .find({ isBlocked: { $eq: true } })
    .populate('user');
  const admin = await adminModel
    .find({ isBlocked: { $eq: true } })
    .populate('user');

  return [...customer, ...admin];
};

// block user
const blockUsrService = async (id: string) => {
  // Check if the user exists
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError(404, 'This account is not found.');
  }

  if (user.isDeleted) {
    throw new AppError(404, 'This account has been deleted.');
  }

  if (user.isBlocked) {
    throw new AppError(400, 'This account is already blocked.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Block the user
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { session, new: true },
    );

    if (!updatedUser?.isBlocked) {
      throw new AppError(400, 'Failed to block the user.');
    }

    let result;
    const role = user.role;

    if (role === USER_ROLE.user) {
      result = await customerModel.findOneAndUpdate(
        { user: user._id },
        { isBlocked: true },
        { session, new: true },
      );
    } else if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
      result = await adminModel.findOneAndUpdate(
        { user: user._id },
        { isBlocked: true },
        { session, new: true },
      );
    }

    if (!result?.isBlocked) {
      throw new AppError(403, `Failed to block the ${user.role}.`);
    }

    await session.commitTransaction();
    return updatedUser;
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new AppError(
      400,
      'Something went wrong while blocking the user. Please try again.',
    );
  } finally {
    session.endSession();
  }
};

// unblock user
const unBlockUsrService = async (id: string) => {
  // Check if the user exists
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError(404, 'This account is not found.');
  }

  if (user.isDeleted) {
    throw new AppError(404, 'This account has been deleted.');
  }

  if (!user.isBlocked) {
    throw new AppError(400, 'This account is already unblocked.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Unblock the user
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { session, new: true },
    );

    if (updatedUser?.isBlocked) {
      throw new AppError(400, 'Failed to unblock the user.');
    }

    let result;
    const role = user.role;

    if (role === USER_ROLE.user) {
      result = await customerModel.findOneAndUpdate(
        { user: user._id },
        { isBlocked: false },
        { session, new: true },
      );
    } else if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
      result = await adminModel.findOneAndUpdate(
        { user: user._id },
        { isBlocked: false },
        { session, new: true },
      );
    }

    if (result?.isBlocked) {
      throw new AppError(403, `Failed to unblock the ${user.role}.`);
    }

    await session.commitTransaction();
    return updatedUser;
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new AppError(
      400,
      'Something went wrong while unblocking the user. Please try again.',
    );
  } finally {
    session.endSession();
  }
};

// delete user
const deleteUsrService = async (id: string) => {
  // Check if the user exists
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError(404, 'This account is not found.');
  }

  if (user.isDeleted) {
    throw new AppError(404, 'This account has already been deleted.');
  }

  if (user.isBlocked) {
    throw new AppError(
      403,
      'This account has been blocked and cannot be deleted.',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // user as deleted
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { session, new: true },
    );

    if (!updatedUser?.isDeleted) {
      throw new AppError(400, 'Failed to delete the user.');
    }

    let result;

    // Handle role-specific deletion
    if (user.role === USER_ROLE.user) {
      result = await customerModel.findOneAndUpdate(
        { user: user._id },
        { isDeleted: true },
        { session, new: true },
      );
    } else if (
      user.role === USER_ROLE.admin ||
      user.role === USER_ROLE.superAdmin
    ) {
      result = await adminModel.findOneAndUpdate(
        { user: user._id },
        { isDeleted: true },
        { session, new: true },
      );
    }

    if (!result?.isDeleted) {
      throw new AppError(
        403,
        `Failed to delete the associated ${user.role} record.`,
      );
    }

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new AppError(
      400,
      'Something went wrong while deleting the user. Please try again.',
    );
  } finally {
    await session.endSession();
  }
};

// create verify email link
const createVerifyEmailLink = async (id: string) => {
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError(404, 'You are not a valid user.');
  }

  if (user?.isVerified) {
    throw new AppError(201, 'You are already verified.');
  }

  const jwtPayload = {
    role: user.role,
    userId: user._id,
  };

  const emailVerificationToken = createToken(
    jwtPayload,
    config.access_token as string,
    '1d',
  );

  const emailVerificationLink = `${config.emailVerifyFrontendLink}?token=${emailVerificationToken}`;

  const subject = 'Verify your account via this link.';

  sendEmail(user.email, subject, emailVerificationLink);
};

const confirmVerification = async (token: string) => {
  const decoded = verifyToken(token, config.access_token as string);

  const { role, userId } = decoded;

  const user = await userModel.findOne({ _id: userId, role });

  if (!user) {
    throw new AppError(404, 'This user is not found.');
  }

  if (user.isBlocked) {
    throw new AppError(404, 'This user is blocked.');
  }

  if (user.isDeleted) {
    throw new AppError(404, 'This user is deleted.');
  }

  return await userModel.findOneAndUpdate(
    { _id: user._id, role },
    { isVerified: true },
    { new: true },
  );
};

export const userService = {
  createCustomerService,
  createAdminService,
  updateUserEmail,
  blockUsrService,
  unBlockUsrService,
  deleteUsrService,
  getMeService,
  getAllUsers,
  getSingleUser,
  getAllBlockedUsers,
  createVerifyEmailLink,
  confirmVerification,
};
