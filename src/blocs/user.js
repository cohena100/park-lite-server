const {
  User,
  Validate
} = require('../models/user');
const Car = require('../models/car');
const uuidv1 = require('uuid/v1');
const {
  pushValidate,
  pullValidate,
} = require('./helpers');

const login = async (data) => {
  const user = await User.findOne({
    phone: data.phone
  });
  if (!user) {
    const newUser = new User({
      phone: data.phone,
    });
    const validate = pushValidate(newUser, 'login');
    await newUser.save();
    return {
      userId: newUser._id,
      validateId: validate._id,
    };
  }
  const validate = pushValidate(user, 'login');
  await user.save();
  return {
    userId: user._id,
    validateId: validate._id,
  };
};

const loginValidate = async (data) => {
  const user = await User.findById(data.userId)
    .populate('cars.car').populate('parking');
  if (!user) {
    throw new Error();
  }
  pullValidate(user, data.validateId);
  user.token = uuidv1();
  await user.save();
  return {
    user,
  };
};

const logout = async (data) => {
  const user = data.user;
  user.token = undefined;
  await user.save();
  return {
    user,
  };
};

module.exports = {
  login,
  loginValidate,
  logout,
};