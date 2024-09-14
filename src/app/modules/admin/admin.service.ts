import AppError from '../../errors/AppError';
import { userModel } from '../user/user.model';
import { IAdmin } from './admin.interface';
import { adminModel } from './admin.model';

const updateAdminInfo = async (id: string, payload: Partial<IAdmin>) => {
  const { address, ...remainingFields } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingFields };
  const user = await userModel.isValidUser(id);

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  if (address && Object.keys(address).length) {
    for (const [key, value] of Object.entries(address)) {
      modifiedData[`address.${key}`] = value;
    }
  }

  const result = await adminModel.findOneAndUpdate(
    { user: user._id },
    modifiedData,
    {
      new: true,
      runValidators: true,
    },
  );

  console.log({ modifiedData });

  return result;
};

export const adminService = { updateAdminInfo };
