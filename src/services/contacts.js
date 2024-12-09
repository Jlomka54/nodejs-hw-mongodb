import { ContactsCollection } from '../db/models/Contact.js';

export const getAllContacts = async () => await ContactsCollection.find();

export const getContactById = async (studentId) => {
  const student = await ContactsCollection.findById(studentId);
  return student;
};
