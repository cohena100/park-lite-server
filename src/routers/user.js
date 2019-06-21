const express = require('express');
const {
  check,
  header,
  validationResult,
} = require('express-validator/check');
const HttpStatus = require('http-status-codes');
const auth = require('../middleware/auth');
const {
  login,
  loginValidate,
  logout,
} = require('../blocs/user');

const userRouter = new express.Router();
userRouter.use(express.json());

const loginUser = async (req, res) => {
  try {
    const result = await login(req.body);
    return res.status(HttpStatus.OK).json({
      validate: {
        userId: result.userId,
        validateId: result.validateId,
      }
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).json({});
  }
};

const loginValidateUser = async (req, res) => {
  try {
    const result = await loginValidate(req.body);
    return res.status(HttpStatus.OK).json({
      user: result.user,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).json({});
  }
};

const logoutUser = async (req, res) => {
  try {
    const result = await logout(req.body);
    return res.status(HttpStatus.OK).json({
      user: result.user,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).json({});
  }
};

userRouter.post('/users/login', [
  check('phone').not().isEmpty().isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
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
    return res.status(HttpStatus.BAD_REQUEST).json({});
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
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await logoutUser(req, res);
});

module.exports = {
  userRouter
};