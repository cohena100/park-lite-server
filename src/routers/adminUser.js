const express = require('express');
const {
  check,
  header,
  validationResult,
} = require('express-validator/check');
const HttpStatus = require('http-status-codes');
const adminAuth = require('../middleware/adminAuth');
const {
  users: adminUserUsers,
} = require('../blocs/adminUser');

const adminUserRouter = new express.Router();
adminUserRouter.use(express.json());

const users = async (req, res) => {
  try {
    const result = await adminUserUsers(req.body);
    return res.status(HttpStatus.OK).json({
      users: result.users,
    });
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).json({});
  }
};


adminUserRouter.post('/adminUsers/users', [
  header('Authorization').not().isEmpty().isUUID(),
  check('adminUserId').not().isEmpty(),
  adminAuth,
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({});
  }
  await users(req, res);
});

module.exports = {
  adminUserRouter
};