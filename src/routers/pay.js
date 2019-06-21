const express = require('express');
const {
  check,
  header,
  validationResult,
} = require('express-validator/check');
const HttpStatus = require('http-status-codes');
const auth = require('../middleware/auth');
const {
  pay: payPay,
} = require('../blocs/pay');

const payRouter = new express.Router();

const pay = async (req, res) => {
  try {
    const result = await payPay(req);
    return res.status(HttpStatus.OK).json({
      received: true,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).json({});
  }
};

payRouter.post('/pay/webhook', [
  check('userId').not().isEmpty(),
  check('paymentId').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await pay(req, res);
});

payRouter.post('/payments/webhook', async (req, res) => {
  console.log('avi');
  console.log(JSON.stringify(req));
  await pay(req, res);
});

payRouter.post('/payments/success', (req, res) => {
  return res.status(HttpStatus.OK).json({
    msg: 'success',
  });
});

payRouter.post('/payments/cancel', (req, res) => {
  return res.status(HttpStatus.OK).json({
    msg: 'cancel',
  });
});

module.exports = {
  payRouter,
};