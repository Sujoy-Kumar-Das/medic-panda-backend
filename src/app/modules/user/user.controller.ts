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

const updateUserEmailController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userService.updateUserEmail(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Email updated successfully.',
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

// get all users controller
const getAllUserController = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All user fetched successfully.',
    data: result,
  });
});

// const getSingleUserController = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await userService.getSingleUser(id);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: ' User fetched successfully.',
//     data: result,
//   });
// });

const getAllBlockedUserController = catchAsync(async (req, res) => {
  const result = await userService.getAllBlockedUsers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All blocked user fetched successfully.',
    data: result,
  });
});

const blockAUserController = catchAsync(async (req, res) => {
  const result = await userService.blockUsrService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User blocked successfully.',
    data: result,
  });
});

const unBlockAUserController = catchAsync(async (req, res) => {
  const result = await userService.unBlockUsrService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User unblock successfully.',
    data: result,
  });
});

const deleteAUserController = catchAsync(async (req, res) => {
  const result = await userService.deleteUsrService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully.',
    data: result,
  });
});

const verifyEmailLinkController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await userService.createVerifyEmailLink(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Please check your email and verify with in 5 minutes.',
    data: result,
  });
});

const confirmEmailVerificationController = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const otp = req.body;

  const result = await userService.confirmVerification(userId, role, otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Email verified successfully.',
    data: result,
  });
});

export const userController = {
  createCustomerController,
  createAdminController,
  updateUserEmailController,
  blockAUserController,
  unBlockAUserController,
  deleteAUserController,
  getMeController,
  getAllUserController,
  // getSingleUserController,
  getAllBlockedUserController,
  verifyEmailLinkController,
  confirmEmailVerificationController,
};
