import { adminModel } from './admin.model';

const getAllAdminService = async () => {
  const result = await adminModel
    .find({ isBlocked: { $ne: true } })
    .populate('user');
  return result;
};

export const adminService = {
  getAllAdminService,
};
