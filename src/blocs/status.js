const {
  enumValue
} = require('../helpers/helpers');

const Status = Object.freeze({
  success: enumValue("Status.success"),
  error: enumValue("Status.error"),
});

module.exports = {
  Status
};