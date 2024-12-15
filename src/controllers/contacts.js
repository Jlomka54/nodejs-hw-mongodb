import createError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsControler = async (req, res, next) => {
  const data = await getAllContacts();

  res.status(200).json({
    status: 200,
    massage: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdControler = async (req, res, next) => {
  const { contactId } = req.params;

  const contacts = await getContactById(contactId);

  // Відповідь, якщо контакт не знайдено
  if (!contacts) {
    throw createHttpError(404, 'Contact not found');
  }

  // Відповідь, якщо контакт знайдено
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contacts,
  });
};

export const createContactController = async (req, res) => {
  const contact = createContact(req.body);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = deleteContact(contactId);
  if (!contact) {
    next(createError(404, 'Student not found'));
  }
  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.student,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    massage: `Successfully patched a contact!`,
    data: result.contact,
  });
};
