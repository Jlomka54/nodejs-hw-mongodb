import {
  logout,
  refreshUserToken,
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
