import {
  logout,
  refreshUserToken,
  requestResetToken,
  resetPassword,
  userLogin,
  userRegister,
} from '../services/auth.js';
import { setupSession } from '../utils/setupSession.js';

export const authRegisterController = async (req, res) => {
  const user = await userRegister(req.body);
  console.log(user);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: user.name,
      email: user.email,
    },
  });
};

export const userLoginController = async (req, res) => {
  console.log(typeof userLoginController);
  const session = await userLogin(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully login user',
    data: { accessToken: session.accessToken },
  });
};

export const refreshTokenController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await refreshUserToken(refreshToken, sessionId);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refresh session',
    data: { accessToken: session.accessToken },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sesionId) {
    await logout(req.cookies.sesionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sesionId');
  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
