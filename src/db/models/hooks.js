export const handlleSaveError = (error, doc, next) => {
  const { name, code } = error;
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400;
  next();
};

export const setUpdateSetting = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
