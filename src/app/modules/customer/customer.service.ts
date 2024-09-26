import AppError from '../../errors/AppError';
import { userModel } from '../user/user.model';
import { ICustomer } from './customer.interface';
import { customerModel } from './customer.model';

const getAllCustomers = async () => {
  const result = await userModel.aggregate([
    {
      $match: {
        role: 'user',
        isDeleted: false,
        isBlocked: false,
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: 'user',
        as: 'customerDetails',
      },
    },
    {
      $match: {
        customerDetails: { $ne: [] },
      },
    },
    {
      $project: {
        email: 1,
        role: 1,
        isBlocked: 1,
        isDeleted: 1,
        customerDetails: 1,
      },
    },
  ]);

  return result;
};

const getSingleCustomers = async (userId: string) => {
  const result = await customerModel.findOne({ user: userId }).populate('user');
  return result;
};

const getBlockedCustomers = async () => {
  const blockedUsers = await userModel.aggregate([
    {
      $match: {
        isBlocked: true,
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: 'user',
        as: 'customerDetails',
      },
    },
    {
      $match: {
        customerDetails: { $ne: [] },
      },
    },
    {
      $project: {
        email: 1,
        role: 1,
        isBlocked: 1,
        customerDetails: 1,
      },
    },
  ]);

  return blockedUsers;
};

const getDeletedCustomers = async () => {
  const deletedUsers = await userModel.aggregate([
    {
      $match: {
        isDeleted: true,
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: 'user',
        as: 'customerDetails',
      },
    },
    {
      $match: {
        customerDetails: { $ne: [] },
      },
    },
    {
      $project: {
        email: 1,
        role: 1,
        isDeleted: 1,
        customerDetails: 1,
      },
    },
  ]);

  return deletedUsers;
};

const updateUserInfo = async (id: string, payload: Partial<ICustomer>) => {
  const { address, ...remainingFields } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingFields };

  if (address && Object.keys(address).length) {
    for (const [key, value] of Object.entries(address)) {
      modifiedData[`address.${key}`] = value;
    }
  }

  const result = await customerModel.findOneAndUpdate(
    { user: id },
    modifiedData,
    {
      new: true,
      runValidators: true,
    },
  );

  console.log({ modifiedData });

  return result;
};

const blockCustomer = async (userId: string) => {
  const customer = await userModel.findById(userId);

  if (!customer) {
    throw new AppError(404, 'This user is not found');
  }

  if (customer.isDeleted) {
    throw new AppError(404, 'This user is deleted');
  }

  const blockStatus = !customer.isBlocked;

  const result = await userModel.findByIdAndUpdate(
    userId,
    { isBlocked: blockStatus },
    { new: true },
  );

  return result;
};

const deleteCustomer = async (userId: string) => {
  const customer = await userModel.findById(userId);

  if (!customer) {
    throw new AppError(404, 'This user is not found');
  }

  const deleteStatus = !customer.isDeleted;

  const result = await userModel.findByIdAndUpdate(
    userId,
    { isDeleted: deleteStatus },
    { new: true },
  );

  return result;
};

export const customerService = {
  updateUserInfo,
  getAllCustomers,
  getBlockedCustomers,
  getSingleCustomers,
  blockCustomer,
  deleteCustomer,
  getDeletedCustomers,
};
