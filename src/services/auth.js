import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { UserCollection } from '../db/models/User.js';
import { SessionCollection } from '../db/models/Session.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';

const createSessionDate = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifeTime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
});

export const userRegister = async (userData) => {
  const { email, password } = userData;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'User allredy exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...userData,
    password: hashPassword,
  });

  return newUser;
};

export const userLogin = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionDate = await createSessionDate();

  return SessionCollection.create({
    userId: user._id,
    ...sessionDate,
  });
};

export const refreshUserToken = async (refreshToken, sessionId) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now() > oldSession.accessTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionDate = createSessionDate();

  return SessionCollection.create({
    userId: oldSession.userId,
    ...sessionDate,
  });
};

export const getUser = (filter) => UserCollection.findOne(filter);

export const getSession = (filter) => SessionCollection.findOne(filter);

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (newUserData) => {
  let entries;

  try {
    entries = jwt.verify(newUserData.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(newUserData.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
