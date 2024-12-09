import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.get('/contacts', async (req, res) => {
    const data = await getAllContacts();

    res.status(200).json({
      status: 200,
      massage: 'Successfully found contacts!',
      data,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;

    const contacts = await getContactById(contactId);

    // Відповідь, якщо контакт не знайдено
    if (!contacts) {
      res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contacts,
    });
  });

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  const port = Number(getEnvVar('PORT', '3000'));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}  `);
  });
};
