import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrWrapper } from '../utils/ctrWrapper.js';

import { authLoginSchema, authRegisterSchema } from '../validation/auth.js';
import * as authController from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/auth/register',
  validateBody(authRegisterSchema),
  ctrWrapper(authController.authRegisterController),
);

authRouter.post(
  '/auth/login',
  validateBody(authLoginSchema),
  ctrWrapper(authController.userLoginController),
);

authRouter.post(
  '/auth/refresh',
  ctrWrapper(authController.refreshTokenController),
);

authRouter.post('/auth/logout', ctrWrapper(authController.logoutController));

export default authRouter;
