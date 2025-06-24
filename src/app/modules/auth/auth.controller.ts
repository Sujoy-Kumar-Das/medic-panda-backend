import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { setCookie } from '../../utils/setCookie';
import { authService } from './auth.service';

const loginController = catchAsync(async (req, res) => {
  const { refreshToken, accessToken } = await authService.loginService(
    req.body,
  );

  // Set access token cookie
  setCookie({
    res,
    name: 'accessToken',
    value: String(accessToken),
    maxAge: 15 * 60 * 1000,
  });

  // Set refresh token cookie
  setCookie({
    res,
    name: 'refreshToken',
    value: String(refreshToken),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully.',
    data: accessToken,
  });
});

const logoutController = catchAsync(async (req, res) => {
  const result = await authService.logoutService();

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logout successfully.',
    data: result,
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

  // Set access token cookie
  setCookie({
    res,
    name: 'accessToken',
    value: String(accessToken),
    maxAge: 15 * 60 * 1000,
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
  logoutController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
  refreshTokenController,
};
