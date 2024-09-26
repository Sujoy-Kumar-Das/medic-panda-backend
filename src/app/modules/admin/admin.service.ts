import AppError from '../../errors/AppError';
import { USER_ROLE } from '../user/user.constant';
import { userModel } from '../user/user.model';
import { IAdmin } from './admin.interface';
import { adminModel } from './admin.model';

const getAllAdmins = async () => {
  const result = await userModel.aggregate([
    {
      $match: {
        role: { $in: [USER_ROLE.admin, USER_ROLE.superAdmin] },
        isDeleted: false,
        isBlocked: false,
      },
    },
    {
      $lookup: {
        from: 'admins',
        localField: '_id',
        foreignField: 'user',
        as: 'adminDetails',
      },
    },
    {
      $match: {
        adminDetails: { $ne: [] },
      },
    },
    {
      $project: {
        email: 1,
        role: 1,
        isBlocked: 1,
        isDeleted: 1,
        adminDetails: 1,
      },
    },
  ]);

  return result;
};

const getSingleAdmin = async (userId: string) => {
  const result = await adminModel.findOne({ user: userId }).populate('user');
  return result;
};

const getBlockedAdmins = async () => {
  const blockedUsers = await userModel.aggregate([
    {
      $match: {
        isBlocked: true,
      },
    },
    {
      $lookup: {
        from: 'admins',
        localField: '_id',
        foreignField: 'user',
        as: 'adminDetails',
      },
    },
    {
      $match: {
        adminDetails: { $ne: [] },
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

const getDeletedAdmins = async () => {
  const deletedUsers = await userModel.aggregate([
    {
      $match: {
        isDeleted: true,
      },
    },
    {
      $lookup: {
        from: 'admins',
        localField: '_id',
        foreignField: 'user',
        as: 'adminDetails',
      },
    },
    {
      $match: {
        adminDetails: { $ne: [] },
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

const blockAdmin = async (userId: string) => {
  const admin = await userModel.findById(userId);

  if (!admin) {
    throw new AppError(404, 'This user is not found');
  }

  if (admin.isDeleted) {
    throw new AppError(404, 'This user is deleted');
  }

  const blockStatus = !admin.isBlocked;

  const result = await userModel.findByIdAndUpdate(
    userId,
    { isBlocked: blockStatus },
    { new: true },
  );

  return result;
};

const deleteAdmin = async (userId: string) => {
  const admin = await userModel.findById(userId);

  if (!admin) {
    throw new AppError(404, 'This user is not found');
  }

  const deleteStatus = !admin.isDeleted;

  const result = await userModel.findByIdAndUpdate(
    userId,
    { isDeleted: deleteStatus },
    { new: true },
  );

  return result;
};

const updateAdminInfo = async (id: string, payload: Partial<IAdmin>) => {
  const { address, ...remainingFields } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingFields };

  if (address && Object.keys(address).length) {
    for (const [key, value] of Object.entries(address)) {
      modifiedData[`address.${key}`] = value;
    }
  }

  const result = await adminModel.findOneAndUpdate({ user: id }, modifiedData, {
    new: true,
    runValidators: true,
  });

  console.log({ modifiedData });

  return result;
};

export const adminService = {
  getAllAdmins,
  getSingleAdmin,
  getBlockedAdmins,
  getDeletedAdmins,
  blockAdmin,
  deleteAdmin,
  updateAdminInfo,
};
