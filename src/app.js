const path = require('path');
const express = require('express');
const HttpStatus = require('http-status-codes');
require('./db/db');
const {
  userRouter
} = require('./routers/user');
const {
  parkRouter
} = require('./routers/park');
const {
  carRouter
} = require('./routers/car');
const {
  payRouter
} = require('./routers/pay');
const {
  adminUserRouter
} = require('./routers/adminUser');

const app = express();

app.get('/', (req, res) => {
  res.status(HttpStatus.OK).send({});
});

app.use(payRouter);
app.use(userRouter);
app.use(parkRouter);
app.use(carRouter);
app.use(adminUserRouter);

app.get('/pay', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.all('*', (req, res) => {
  res.status(HttpStatus.NOT_FOUND).send({});
});

module.exports = {
  app
};