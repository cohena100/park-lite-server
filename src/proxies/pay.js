const {
  User,
  Validate
} = require('../models/user');
const Payment = require('../models/payment');
const Parking = require('../models/parking');

const create = async (amount) => {
  return {
    id: '1',
  };
};

module.exports = {
  create,
};