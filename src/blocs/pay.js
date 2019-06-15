const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  create: payCreate,
} = require('../proxies/pay');
const {
  User,
} = require('../models/user');
const Parking = require('../models/parking');
const Payment = require('../models/payment');

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
    parking: parking.id,
  });
  await payment.save();
  user.payment = payment.id;
  await user.save();
  return await Payment.findById(payment.id);
};

const pay = async (data) => {
  const user = await User.findById(data.userId).populate('payment');
  if (!user || !user.payment || user.payment.id !== data.paymentId) {
    throw new Error();
  }
  user.payment = undefined;
  user.parking = undefined;
  await user.save();
};

module.exports = {
  create,
  pay,
};