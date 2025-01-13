import createError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/Contact.js';
import { ParseContactsFiltersParams } from '../utils/filters/ParseContactsFiltersParams.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsControler = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = ParseContactsFiltersParams(req.query);
  filter.userId = req.user._id;

  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    massage: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdControler = async (req, res) => {
  const { _id: userId } = req.user;

  const { contactId } = req.params;

  const contacts = await getContactById(contactId, userId);

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
  const photo = req.file;

  let photoUrl;
  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadsDir(photo);
    }
  }

  const { _id: userId } = req.user;

  const contact = await createContact({ ...req.body, photo: photoUrl, userId });
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const result = await updateContact(
    contactId,
    { ...req.body, userId },
    userId,
    {
      upsert: true,
    },
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.student,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;
  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadsDir(photo);
    }
  }

  const result = await updateContact(
    contactId,
    { ...req.body, photo: photoUrl },
    userId,
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    massage: `Successfully patched a contact!`,
    data: result.contact,
  });
};
