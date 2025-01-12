import { Schema, model } from 'mongoose';
import { handlleSaveError, setUpdateSetting } from './hooks.js';
import { emailRegept } from '../../constants/users.js';
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: emailRegept,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handlleSaveError);
userSchema.post('findOneAndUpdate', handlleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSetting);

export const UserCollection = model('user', userSchema);
