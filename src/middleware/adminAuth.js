const HttpStatus = require('http-status-codes');
const AdminUser = require('../models/adminUser');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    const adminUser = await AdminUser.findById(req.body.adminUserId);
    if (!adminUser || adminUser.token !== token) {
      return res.status(HttpStatus.UNAUTHORIZED).send({});
    }
    req.body.adminUser = adminUser;
    next();
  } catch (e) {
    res.status(HttpStatus.BAD_REQUEST).send({});
  }
};

module.exports = adminAuth;