const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEB_HOOK_SECRET_KEY;
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
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const user = await User.findById(session.metadata.userId).populate('payment');
    if (!user || !user.payment || user.payment.id !== session.metadata.paymentId) {
      throw new Error();
    }
    user.payment = undefined;
    user.parking = undefined;
    await user.save();
  } else {
    throw new Error();
  }
};

module.exports = {
  create,
  pay,
};