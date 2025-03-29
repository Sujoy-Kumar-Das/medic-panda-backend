/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Model } from 'mongoose';
import QueryBuilder from '../../builder/queryBuilder';
import sendOtpEmailTemplate from '../../emailTemplate/verifyUserEmailTemplate';
import AppError from '../../errors/AppError';
import { IUserRoles } from '../../interface/user.roles.interface';
import generateOTP from '../../utils/generateOTP';
import { sendEmail } from '../../utils/sendEmail';
import { IAdmin } from '../admin/admin.interface';
import { adminModel } from '../admin/admin.model';
import {
  ICustomer,
  IUserPermanentAddress,
} from '../customer/customer.interface';
import { customerModel } from '../customer/customer.model';
import { userModel } from '../user/user.model';
import { USER_ROLE } from './user.constant';
import { IUser } from './user.interface';

interface ICustomerPayload extends ICustomer {
  email: string;
  password: string;
}

interface IUpdateCustomerPayload extends IUser {
  name: string;
  photo: string;
  contact?: string | null;
  address: IUserPermanentAddress;
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
const createAdminService = async (payload: { email: string }) => {
  const { email } = payload;

  // check is the user already exists
  const user = await userModel.isUserExists(email);

  if (!user) {
    throw new AppError(403, `This user is not exists.`);
  }

  if (user.role === 'admin' || user.role === 'superAdmin') {
    throw new AppError(403, `This user is already a ${user.role}`);
  }

  if (!user.isVerified) {
    throw new AppError(403, 'This user is not verified.');
  }

  if (user.isBlocked) {
    throw new AppError(403, 'This user is blocked.');
  }

  if (user.isDeleted) {
    throw new AppError(403, 'This user is deleted.');
  }

  // create a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    // update the user role as a admin
    const updateRole = await userModel.findOneAndUpdate(
      { email },
      { role: USER_ROLE.admin },
      { new: true, session },
    );

    if (updateRole?.role !== USER_ROLE.admin) {
      throw new AppError(400, 'Flailed to create admin.');
    }

    // find the user data form customer model
    const userData = await customerModel.findOne({ user: user._id });

    if (!userData) {
      throw new AppError(404, 'Invalid user account.');
    }

    // create the admin data
    const adminData = {
      user: user._id,
      name: userData?.name,
      photo: userData?.photo,
      contact: userData?.contact ? userData?.contact : null,
    };

    // create admin in admin model
    const createAdmin = await adminModel.create([adminData], {
      session,
    });

    if (!createAdmin.length) {
      throw new AppError(400, 'Failed to create admin.');
    }

    // delete the user from customer model after update to admin role
    await customerModel.findByIdAndDelete(userData._id);

    // commit the transaction
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

  let result;

  if (user.role === USER_ROLE.user) {
    result = await customerModel.findOne({ user: user._id }).populate('user');
  }

  if (user.role === USER_ROLE.admin) {
    result = await adminModel.findOne({ user: user._id }).populate('user');
  }

  if (user.role === USER_ROLE.superAdmin) {
    result = await adminModel.findOne({ user: user._id }).populate('user');
  }

  return result;
};

// get all users
const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    userModel.find({ isDeleted: false }),
    query,
  );

  const users = userQuery.search(['email']).filter().paginate().sort();

  const meta = await users.countTotal();

  const result = await users.modelQuery.select(
    '_id email isVerified role isBlocked',
  );

  return { meta, data: result };
};

// get single users
const getSingleUser = async (id: string) => {
  const user = await userModel.findUserWithID(id);

  if (!user) {
    throw new AppError(404, 'This user is not found.');
  }

  const role = user.role;

  if (role === USER_ROLE.user) {
    return await customerModel
      .findOne({ user: id, role })
      .populate('user', '+isBlocked');
  }

  if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    return await adminModel
      .findOne({ user: id })
      .populate('user', '+isBlocked');
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
const blockUsrService = async (payload: { id: string }) => {
  const { id } = payload;
  // Check if the user exists
  const user = await userModel.findUserWithID(id);

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
    const updatedUser = await userModel
      .findByIdAndUpdate(id, { isBlocked: true }, { session, new: true })
      .select('+isBlocked');

    if (!updatedUser?.isBlocked) {
      throw new AppError(400, 'Failed to block the user.');
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
const unBlockUsrService = async (payload: { id: string }) => {
  const { id } = payload;
  // Check if the user exists
  const user = await userModel.findUserWithID(id);

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
    const updatedUser = await userModel
      .findByIdAndUpdate(id, { isBlocked: false }, { session, new: true })
      .select('+isBlocked');

    if (updatedUser?.isBlocked) {
      throw new AppError(400, 'Failed to unblock the user.');
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
const deleteUsrService = async (payload: { id: string }) => {
  const { id } = payload;
  // Check if the user exists
  const user = await userModel.findUserWithID(id);

  if (!user) {
    throw new AppError(404, 'This account is not found.');
  }

  if (user.isDeleted) {
    throw new AppError(404, 'This account has already been deleted.');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // user as deleted
    const updatedUser = await userModel
      .findByIdAndUpdate(id, { isDeleted: true }, { session, new: true })
      .select('+isDeleted');

    if (!updatedUser?.isDeleted) {
      throw new AppError(400, 'Failed to delete the user.');
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      400,
      'Something went wrong while deleting the user. Please try again.',
    );
  } finally {
    await session.endSession();
  }
};

// createVerifyEmailLink
const createVerifyEmailLink = async (id: string) => {
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError(404, 'User not found.');
  }
  if (user.isVerified) {
    throw new AppError(201, 'Already verified.');
  }

  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

  if (user.otpTime && user.otpTime > twoMinutesAgo) {
    throw new AppError(401, 'Please wait 2 minutes before requesting again.');
  }

  const userInfo =
    user.role === USER_ROLE.user
      ? await customerModel.findOne({ user: user._id })
      : await adminModel.findOne({ user: user._id });

  if (!userInfo) {
    throw new AppError(404, 'User information not found.');
  }

  const otpCode = generateOTP();
  const result = await userModel.findOneAndUpdate(
    { _id: user._id },
    { otpCode, otpTime: new Date() },
    { new: true },
  );

  if (!result?.otpCode || !result.otpTime) {
    throw new AppError(404, 'OTP generation failed.');
  }

  sendEmail(
    user.email,
    'Verify your account',
    sendOtpEmailTemplate({
      name: userInfo.name,
      otpCode,
    }),
  );
};

// confirmVerification
const confirmVerification = async (
  userId: string,
  role: string,
  payload: { otp: number },
) => {
  const { otp } = payload;

  const user = await userModel.findOne({ _id: userId, role });

  // Check if user exists
  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  // Check if user is already verified
  if (user.isVerified) {
    throw new AppError(401, 'Already verified.');
  }

  const now = new Date(); // Current time

  // Check if otpTime is available and parse it
  if (!user.otpTime) {
    throw new AppError(401, 'OTP has not been sent yet.');
  }

  const otpSentTime = new Date(user.otpTime); // Parse the otpTime from the user object
  const twoMinutesAfterOtpSent = new Date(
    otpSentTime.getTime() + 2 * 60 * 1000,
  );

  // Check if OTP is expired (it should be less than or equal to 2 minutes after it was sent)
  if (now > twoMinutesAfterOtpSent) {
    throw new AppError(401, 'This OTP is expired. Please try again.');
  }

  // Allow OTP attempts only if wrong attempts are within the time frame
  if (user.wrongOTPAttempt > 3 && now < twoMinutesAfterOtpSent) {
    throw new AppError(401, 'Too many attempts. Please wait 2 minutes.');
  }

  // Check if the provided OTP matches the stored OTP
  if (user.otpCode !== otp) {
    // Increment wrong OTP attempt count
    await userModel.findByIdAndUpdate(userId, {
      $inc: { wrongOTPAttempt: 1 },
    });
    throw new AppError(401, 'Incorrect OTP.');
  }

  // Mark user as verified and reset the wrong attempt counter
  const result = await userModel.findOneAndUpdate(
    { _id: user._id, role },
    { isVerified: true, wrongOTPAttempt: 0 }, // Reset wrong attempts on success
    { new: true },
  );

  // Check if the update was successful
  if (!result?.isVerified) {
    throw new AppError(404, 'Verification failed.');
  }

  return result;
};

// update user info

const updateUserInfo = async (
  id: string,
  role: IUserRoles,
  payload: Partial<IUpdateCustomerPayload>,
) => {
  const { address, email, password, ...remainingFields } = payload;

  if (email || password) {
    throw new AppError(400, 'Bad request for update user info.');
  }

  const modifiedData: Record<string, unknown> = { ...remainingFields };

  if (address && Object.keys(address).length) {
    for (const [key, value] of Object.entries(address)) {
      modifiedData[`address.${key}`] = value;
    }
  }

  const model = (
    role === USER_ROLE.admin || role === USER_ROLE.superAdmin
      ? adminModel
      : customerModel
  ) as Model<ICustomer | IAdmin>;

  return await model.findOneAndUpdate({ user: id }, modifiedData, {
    new: true,
    runValidators: true,
  });
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
  updateUserInfo,
};
