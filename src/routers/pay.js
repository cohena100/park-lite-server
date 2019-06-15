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
    const result = await payPay(req.body);
    return res.status(HttpStatus.OK).send({
      received: true,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send({});
  }
};

payRouter.post('/pay/webhook', [
  check('paymentId').not().isEmpty(),
  check('userId').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await pay(req, res);
});

module.exports = {
  payRouter,
};