const express = require('express');
const {
  check,
  header,
  validationResult,
} = require('express-validator/check');
const HttpStatus = require('http-status-codes');
const auth = require('../middleware/auth');
const {
  start: parkStart,
  end: parkEnd,
} = require('../blocs/park');
const {
  create: payCreate,
} = require('../blocs/pay');

const parkRouter = new express.Router();

const start = async (req, res) => {
  try {
    const parking = await parkStart(req.body);
    return res.status(HttpStatus.OK).send({
      parking,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send({});
  }
};

const end = async (req, res) => {
  try {
    const parking = await parkEnd(req.body);
    req.body.parking = parking;
    const payment = await payCreate(req.body);
    return res.status(HttpStatus.OK).send({
      parking,
      payment,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send({});
  }
};

parkRouter.post('/parkings/start', [
  header('Authorization').not().isEmpty().isUUID(),
  check('userId').not().isEmpty(),
  check('carId').not().isEmpty(),
  check('lat').not().isEmpty(),
  check('lon').not().isEmpty(),
  check('cityId').not().isEmpty(),
  check('cityName').not().isEmpty(),
  check('areaId').not().isEmpty(),
  check('areaName').not().isEmpty(),
  check('rateId').not().isEmpty(),
  check('rateName').not().isEmpty(),
  auth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await start(req, res);
});

parkRouter.post('/parkings/end', [
  header('Authorization').not().isEmpty().isUUID(),
  check('userId').not().isEmpty(),
  check('parkingId').not().isEmpty(),
  auth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await end(req, res);
});

module.exports = {
  parkRouter
};