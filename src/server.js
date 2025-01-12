import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.static('uploads'));
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(authRouter);
  app.use(contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);
  const port = Number(getEnvVar('PORT', '3000'));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}  `);
  });
};
