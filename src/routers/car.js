const express = require('express');
const {
  check,
  header,
  validationResult,
} = require('express-validator/check');
const HttpStatus = require('http-status-codes');
const auth = require('../middleware/auth');
const {
  add: carAdd,
  addValidate: carAddValidate,
  remove: carRemove,
} = require('../blocs/car');

const carRouter = new express.Router();
carRouter.use(express.json());

const add = async (req, res) => {
  try {
    const result = await carAdd(req.body);
    return res.status(HttpStatus.OK).json({
      validate: {
        validateId: result.validateId,
      }
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).json({});
  }
};

const addValidate = async (req, res) => {
  try {
    const result = await carAddValidate(req.body);
    return res.status(HttpStatus.OK).json({
      car: result.car,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).json({});
  }
};

const remove = async (req, res) => {
  try {
    const car = await carRemove(req.body);
    return res.status(HttpStatus.OK).json({
      car,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).json({});
  }
};

carRouter.post('/cars/add', [
  header('Authorization').not().isEmpty().isUUID(),
  check('userId').not().isEmpty(),
  auth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await add(req, res);
});

carRouter.post('/cars/addValidate', [
  header('Authorization').not().isEmpty().isUUID(),
  check('userId').not().isEmpty(),
  check('number').not().isEmpty().isNumeric(),
  check('nickname').not().isEmpty(),
  check('validateId').not().isEmpty(),
  check('code').not().isEmpty().isNumeric(),
  auth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await addValidate(req, res);
});

carRouter.post('/cars/remove', [
  header('Authorization').not().isEmpty().isUUID(),
  check('userId').not().isEmpty(),
  check('carId').not().isEmpty(),
  auth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await remove(req, res);
});

module.exports = {
  carRouter,
};