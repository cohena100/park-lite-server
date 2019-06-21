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
    console.log('avi');
    console.log(JSON.stringify(req));
    const result = await payPay(req);
    return res.status(HttpStatus.OK).send({
      received: true,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send({});
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
  await pay(req, res);
});

payRouter.post('/payments/success', async (req, res) => {
  return res.status(HttpStatus.OK).send({
    msg: 'success',
  });
});

payRouter.post('/payments/cancel', async (req, res) => {
  return res.status(HttpStatus.OK).send({
    msg: 'cancel',
  });
});

module.exports = {
  payRouter,
};