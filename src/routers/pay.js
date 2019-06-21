const express = require('express');
const {
  check,
  header,
  validationResult,
} = require('express-validator/check');
const HttpStatus = require('http-status-codes');
const bodyParser = require('body-parser');
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

payRouter.post('/payments/webhook', bodyParser.raw({
  type: 'application/json'
}), async (req, res) => {
  await pay(req, res);
});

payRouter.get('/payments/success', (req, res) => {
  return res.status(HttpStatus.OK).json({
    msg: 'success',
  });
});

payRouter.get('/payments/cancel', (req, res) => {
  return res.status(HttpStatus.OK).json({
    msg: 'cancel',
  });
});

module.exports = {
  payRouter,
};