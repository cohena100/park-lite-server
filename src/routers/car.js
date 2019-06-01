const express = require('express');
const {
  Status
} = require('../blocs/status');
const {
  add: carAdd,
  addValidate: carAddValidate,
  remove: carRemove,
} = require('../blocs/car');
const {
  check,
  header,
  validationResult
} = require('express-validator/check');
const auth = require('../middleware/auth');

const carRouter = new express.Router();

const add = async (req, res) => {
  try {
    const result = await carAdd(req.body);
    switch (result.status) {
      case Status.success:
        return res.status(200).send({
          validate: {
            validateId: result.validateId,
          }
        });
      default:
        return res.status(400).send({});
    }
  } catch (e) {
    res.status(400).send({});
  }
};

const addValidate = async (req, res) => {
  try {
    const result = await carAddValidate(req.body);
    switch (result.status) {
      case Status.success:
        return res.status(200).send({
          car: result.car,
        });
      default:
        return res.status(400).send({});
    }
  } catch (e) {
    res.status(400).send({});
  }
};

const remove = async (req, res) => {
  try {
    const car = await carRemove(req.body);
    return res.status(200).send({
      car,
    });
  } catch (e) {
    res.status(400).send({});
  }
};

carRouter.post('/cars/add', [
  header('Authorization').not().isEmpty().isUUID(),
  check('userId').not().isEmpty(),
  auth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({});
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
    return res.status(400).json({});
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
    return res.status(400).json({});
  }
  await remove(req, res);
});

module.exports = {
  carRouter,
};