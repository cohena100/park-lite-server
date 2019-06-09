const moment = require('moment');
const {
  User,
} = require('../models/user');
const Parking = require('../models/parking');
const Payment = require('../models/payment');
const {
  create: payCreate,
} = require('../proxies/pay');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const create = async (data) => {
  const user = data.user;
  const parking = data.parking;
  const start = moment(parking.startDate);
  const end = moment(parking.endDate);
  const duration = moment.duration(end.diff(start));
  const amount = parking.ratePrice * duration;
  const session = await payCreate();
  const payment = new Payment({
    amount,
    sessionId: session.id,
    parking: parking._id,
  });
  await payment.save();
  user.payment = payment._id;
  await user.save();
  return await Payment.findById(payment._id);
};

module.exports = {
  create,
};