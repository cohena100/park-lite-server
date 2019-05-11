const express = require('express');
const {
  start: parkStart,
  stop: parkStop,
} = require('../blocs/park');
const {
  check,
  header,
  validationResult
} = require('express-validator/check');
const auth = require('../middleware/auth');

const parkRouter = new express.Router();

const start = async (req, res) => {
  try {
    const parking = await parkStart(req.body);
    return res.status(200).send({
      parking,
    });
  } catch (e) {
    res.status(400).send({});
  }
};

const stop = async (req, res) => {
  try {
    const parking = await parkStop(req.body);
    return res.status(200).send({
      parking,
    });
  } catch (e) {
    res.status(400).send({});
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
    return res.status(400).json({});
  }
  await start(req, res);
});

parkRouter.post('/parkings/stop', [
  header('Authorization').not().isEmpty().isUUID(),
  check('userId').not().isEmpty(),
  check('parkingId').not().isEmpty(),
  auth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({});
  }
  await stop(req, res);
});

module.exports = {
  parkRouter
};