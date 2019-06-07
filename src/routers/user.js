const express = require('express');
const {
  Status
} = require('../blocs/status');
const {
  login,
  loginValidate,
  logout,
} = require('../blocs/user');
const {
  check,
  header,
  validationResult,
} = require('express-validator/check');
const auth = require('../middleware/auth');

const userRouter = new express.Router();

const loginUser = async (req, res) => {
  try {
    const result = await login(req.body);
    return res.status(200).send({
      validate: {
        userId: result.userId,
        validateId: result.validateId,
      }
    });
  } catch (e) {
    res.status(400).send({});
  }
};

const loginValidateUser = async (req, res) => {
  try {
    const result = await loginValidate(req.body);
    return res.status(200).send({
      user: result.user,
    });
  } catch (e) {
    res.status(400).send({});
  }
};

const logoutUser = async (req, res) => {
  try {
    const result = await logout(req.body);
    return res.status(200).send({
      user: result.user,
    });
  } catch (e) {
    res.status(400).send({});
  }
};

userRouter.post('/users/login', [
  check('phone').not().isEmpty().isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({});
  }
  await loginUser(req, res);
});

userRouter.post('/users/loginValidate', [
  check('userId').not().isEmpty(),
  check('validateId').not().isEmpty(),
  check('code').not().isEmpty().isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({});
  }
  await loginValidateUser(req, res);
});

userRouter.post('/users/logout', [
  header('Authorization').not().isEmpty().isUUID(),
  check('userId').not().isEmpty(),
  auth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({});
  }
  await logoutUser(req, res);
});

module.exports = {
  userRouter
};