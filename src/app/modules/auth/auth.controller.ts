import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { setCookie } from '../../utils/setCookie';
import { authService } from './auth.service';


const singup = catchAsync(async (req, res) => {
  const result = await authService.singup(
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP sent your email successfully.',
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const result = await authService.verifyOtp(
    req.body,
  );

  const { user, access_token, refresh_token } = result;

  // check access token and auto login after verification
  if (access_token && refresh_token) {
    // Set access and refresh token in cookie
    setCookie({
      res,
      name: config.access_key as string,
      value: String(access_token),
      options: {
        maxAge: 15 * 60 * 1000
      }
    });

    setCookie({
      res,
      name: config.refresh_key as string,
      value: String(refresh_token),
      options: {
        maxAge: 15 * 24 * 60 * 60 * 1000
      }
    });


  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `welcome ${req?.body?.name} your account created successfully.`,
    data: {
      access_token,
      user
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { access_token, refresh_token, user } = await authService.login(
    req.body,
  );

  // check access token and auto login after verification
  if (access_token && refresh_token) {
    // Set access and refresh token in cookie
    setCookie({
      res,
      name: config.access_key as string,
      value: String(access_token),
      options: {
        maxAge: 15 * 60 * 1000
      }
    });

    setCookie({
      res,
      name: config.refresh_key as string,
      value: String(refresh_token),
      options: {
        maxAge: 15 * 24 * 60 * 60 * 1000
      }
    });


  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Log in successfully.',
    data: {
      access_token,
      user
    },
  });
});


const logout = catchAsync(async (req, res) => {

  const { userId } = req.user;

  const result = await authService.logout({ userId });

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    path: '/',
  };

  res.clearCookie(config.access_key as string, cookieOptions);
  res.clearCookie(config.refresh_key as string, cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logout successfully.',
    data: result,
  });
});



const changePassword = catchAsync(async (req, res) => {
  const result = await authService.changePassword(req.user, req.body);

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    path: '/',
  };

  res.clearCookie(config.access_key as string, cookieOptions);
  res.clearCookie(config.refresh_key as string, cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Password changed successfully.',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
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

const refreshToken = catchAsync(async (req, res) => {
  const { refresh_token: currentToken } = req.cookies;

  const { access_token, refresh_token } = await authService.refreshToken(currentToken);

  // check access token and auto login after verification
  if (access_token && refresh_token) {
    // Set access and refresh token in cookie
    setCookie({
      res,
      name: config.access_key as string,
      value: String(access_token),
      options: {
        maxAge: 15 * 60 * 1000
      }
    });

    setCookie({
      res,
      name: config.refresh_key as string,
      value: String(refresh_token),
      options: {
        maxAge: 15 * 24 * 60 * 60 * 1000
      }
    });


  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Access token retrieve successfully.',
    data: { access_token },
  });
});

export const authController = {
  singup,
  verifyOtp,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPasswordController,
  refreshToken,
};
