const path = require('path');
const express = require('express');
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

const app = express();

app.get('/', (req, res) => {
  res.send({
    msg: 'whatever...'
  });
});

app.use(express.json());
app.use(userRouter);
app.use(parkRouter);
app.use(carRouter);

app.get('/pay', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.all('*', (req, res) => {
  res.status(404).send({});
});

module.exports = {
  app
};