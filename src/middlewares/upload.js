import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, TEMP_UPLOAD_DIR);
  //   },
  destination: TEMP_UPLOAD_DIR,
  fileName: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + '-' + uniqueSuffix;
    cb(null, fileName);
  },
});

const limit = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilte = (req, file, cb) => {
  const extention = file.originalname.split('.').pop();
  if (extention === 'exe') {
    return cb(createHttpError(400, 'file whith .exe extention not allow'));
  }
  cb(null, true);
};
export const upload = multer({
  storage,
  limit,
  fileFilte,
});
