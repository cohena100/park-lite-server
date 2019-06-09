const {
  User,
} = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const user = await User.findById(req.body.userId)
      .populate('cars.car').populate('parking').populate('payment');
    if (!user || user.token !== token) {
      return res.status(401).send({});
    }
    req.body.user = user;
    next();
  } catch (e) {
    res.status(400).send({});
  }
};

module.exports = auth;