import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authService } from './auth.service';

const loginController = catchAsync(async (req, res) => {
  const { refreshToken, accessToken } = await authService.loginService(
    req.body,
  );

  res.cookie('accessToken', accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
  });

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully.',
    data: accessToken,
  });
});

const changePasswordController = catchAsync(async (req, res) => {
  const result = await authService.changePasswordService(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Password changed successfully.',
    data: result,
  });
});

const forgotPasswordController = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Please check your email.',
    data: result,
  });
});

const resetPasswordController = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await authService.resetPassword(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Password reset successfully.',
    data: result,
  });
});

const refreshTokenController = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await authService.refreshTokenService(refreshToken);

  res.cookie('accessToken', accessToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Access token retrieve successfully.',
    data: null,
  });
});

export const authController = {
  loginController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
  refreshTokenController,
};
