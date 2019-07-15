const {
  User,
} = require('../models/user');

const users = async (data) => {
  const users = await User.find();
  return {
    users,
  };
};

module.exports = {
  users,
};