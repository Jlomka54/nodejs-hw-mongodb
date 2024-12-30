// src/db/models/student.js

import { Schema, model } from 'mongoose';
import { contactsType } from '../../constants/contacts.js';
import { handlleSaveError, setUpdateSetting } from './hooks.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactsType,

      required: true,
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      fer: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactsSchema.post('save', handlleSaveError);
contactsSchema.post('findOneAndUpdate', handlleSaveError);

contactsSchema.pre('findOneAndUpdate', setUpdateSetting);
export const sortByList = [
  '_id',
  'name',
  'email',
  'phoneNumber',
  'isFavourite',
  'contactType',
];

export const ContactsCollection = model('contact', contactsSchema);
