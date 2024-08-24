import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';

const createCustomerController = catchAsync(async (req, res) => {
  const result = await userService.createCustomerService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer created successfully.',
    data: result,
  });
});

const createAdminController = catchAsync(async (req, res) => {
  const result = await userService.createAdminService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin created successfully.',
    data: result,
  });
});

const getMeController = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await userService.getMeService(userId, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully.',
    data: result,
  });
});

export const userController = {
  createCustomerController,
  createAdminController,
  getMeController,
};
