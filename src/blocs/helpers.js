const {
  Status
} = require('./status');
const {
  User,
  Validate
} = require('../models/user');

const pushValidate = (user, type) => {
  var validate = user.validates.filter((v) => v.type === type).pop();
  if (!validate) {
    const newValidate = new Validate({
      type,
    });
    user.validates.push(newValidate);
    return newValidate;
  }
  return validate;
};

const pullValidate = (user, validateId) => {
  const validate = user.validates.id(validateId);
  if (!validate) {
    throw new Error();
  }
  user.validates.pull(validateId);
};

const checkValidate = (user, validateId) => {
  const validate = user.validates.id(validateId);
  return validate != null ? true : false;
};

module.exports = {
  pushValidate,
  pullValidate,
  checkValidate,
};