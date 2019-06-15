const HttpStatus = require('http-status-codes');
const {
  User,
} = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const user = await User.findById(req.body.userId)
      .populate('cars.car').populate('parking').populate('payment');
    if (!user || user.token !== token) {
      return res.status(HttpStatus.UNAUTHORIZED).send({});
    }
    req.body.user = user;
    next();
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send({});
  }
};

module.exports = auth;