const {
  enumValue
} = require('../helpers/helpers');

const Status = Object.freeze({
  success: enumValue("Status.success"),
  validate: enumValue("Status.validate"),
  error: enumValue("Status.error")
});

module.exports = {
  Status
};