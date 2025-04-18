import mongoose from 'mongoose';
import config from '../config';
import AppError from '../errors/AppError';
import { adminModel } from '../modules/admin/admin.model';
import { USER_ROLE } from '../modules/user/user.constant';
import { userModel } from '../modules/user/user.model';

const supperAdminData = {
  email: config.supperAdminEmail as string,
  password: config.supperAdminPassword as string,
  role: USER_ROLE.superAdmin,
};

const seedSupperAdmin = async () => {
  const supperAdminExists = await userModel.findOne({
    role: USER_ROLE.superAdmin,
  });

  if (!supperAdminExists) {
    const session = await mongoose.startSession();

    try {
      // start transaction
      session.startTransaction();

      // update the user role as a admin
      const createUser = await userModel.create([supperAdminData], { session });

      if (!createUser[0]) {
        throw new AppError(400, 'Flailed to create supper admin.');
      }

      // create the admin data
      const adminData = {
        user: createUser[0]._id,
        name: 'Medic Panda',
        photo: '',
        contact: null,
      };

      // create admin in admin model
      const createAdmin = await adminModel.create([adminData], {
        session,
      });

      if (!createAdmin.length) {
        throw new AppError(400, 'Failed to create supper admin.');
      }

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
  }
};

export default seedSupperAdmin;
