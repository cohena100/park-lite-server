const moment = require('moment');
const {
  create: payCreate,
  pay: payPay,
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
  const duration = moment.duration(end.diff(start)).asSeconds();
  const amount = parking.ratePrice * duration;
  const payment = new Payment({
    amount,
    parking: parking.id,
  });
  const session = await payCreate({
    amount,
    userId: user.id,
    paymentId: payment.id,
  });
  payment.sessionId = session.id;
  await payment.save();
  user.payment = payment.id;
  await user.save();
  return await Payment.findById(payment.id);
};

const pay = async (req) => {
  const result = await payPay(req);
  const user = await User.findById(result.userId).populate('payment');
  if (!user || !user.payment || user.payment.id !== result.paymentId) {
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