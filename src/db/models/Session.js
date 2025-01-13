import { Schema, model } from 'mongoose';
import { handlleSaveError, setUpdateSetting } from './hooks.js';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

sessionSchema.post('save', handlleSaveError);
sessionSchema.post('findOneAndUpdate', handlleSaveError);

sessionSchema.pre('findOneAndUpdate', setUpdateSetting);

export const SessionCollection = model('session', sessionSchema);
