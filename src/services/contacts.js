import { ContactsCollection } from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const contactsQuery = ContactsCollection.find();
  if (filter.type) {
    contactsQuery.where('contactType').eq(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').eq(filter.isFavourite);
  }
  const limit = perPage;
  const skip = (page - 1) * limit;
  const data = await contactsQuery
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const paginationData = calcPaginationData({ totalItems, page, perPage });
  return {
    data,
    page,
    perPage,
    totalItems,

    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = (contactData) =>
  ContactsCollection.create(contactData);

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const patchContact = () => {};
