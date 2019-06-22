const pay = require('../src/proxies/pay');
jest.mock('../src/proxies/pay');

const request = require('supertest');
const HttpStatus = require('http-status-codes');
var {
  app
} = require('../src/app');
const {
  User,
} = require('../src/models/user');
const Car = require('../src/models/car');
const Parking = require('../src/models/parking');
const Payment = require('../src/models/payment');

const code = '8261';
const phone1 = '1';
var user1;
var validate1;
var car1;
const number1 = '2';
var nickname1 = 'a';
var parkingData;
var loginData;
var carData;
var payData;

const sendLogin = (data) => {
  return request(app).post('/users/login').send(data);
};

const sendLoginValidate = (data) => {
  return request(app).post('/users/loginValidate').send(data);
};

const sendLogout = (data, token) => {
  return request(app).post('/users/logout')
    .set('Authorization', token).send(data);
};

const sendAdd = (data, token) => {
  return request(app).post('/cars/add')
    .set('Authorization', token).send(data);
};

const sendAddValidate = (data, token) => {
  return request(app).post('/cars/addValidate')
    .set('Authorization', token).send(data);
};

const sendRemove = (data, token) => {
  return request(app).post('/cars/remove')
    .set('Authorization', token).send(data);
};

const sendStart = (data, token) => {
  return request(app).post('/parkings/start')
    .set('Authorization', token).send(data);
};

const sendEnd = (data, token) => {
  return request(app).post('/parkings/end')
    .set('Authorization', token).send(data);
};

const sendPayWebhook = (data) => {
  return request(app).post('/payments/webhook').send(data);
};

const loginUser1 = () => {
  return request(app).post('/users/login').send(user1);
};

const startParkingUser1 = () => {
  parkingData.userId = user1.userId;
  parkingData.carId = car1.carId;
  return sendStart(parkingData, user1.token);
};

const endParkingUser1 = () => {
  return sendEnd(parkingData, user1.token);
};

const paymentUser1 = () => {
  return sendPayWebhook(payData);
};

const loginAndValidateUser1 = async () => {
  const res = await loginUser1();
  const userId = res.body.validate.userId;
  const validateId = res.body.validate.validateId;
  user1.userId = userId;
  validate1.userId = userId;
  validate1.validateId = validateId;
  return sendLoginValidate(validate1);
};

const addUser1 = async () => {
  const res = await loginAndValidateUser1();
  user1.token = res.body.user.token;
};

const parkUser1 = async () => {
  const res = await startParkingUser1();
  parkingData.parkingId = res.body.parking._id;
  parkingData.parkingCityId = res.body.parking.cityId;
};

const endParkUser1 = async () => {
  const res = await endParkingUser1();
  payData.userId = user1.userId;
  payData.paymentId = res.body.payment._id;
};

const startAndEndParkUser1 = async () => {
  await parkUser1();
  await endParkUser1();
};

const addCar1 = async () => {
  carData.userId = user1.userId;
  var res = await sendAdd(carData, user1.token);
  const validateId = res.body.validate.validateId;
  carData.number = car1.number;
  carData.nickname = car1.nickname;
  carData.validateId = validateId;
  carData.code = code;
  res = await sendAddValidate(carData, user1.token);
  car1.carId = res.body.car._id;
  car1.carNumber = res.body.car.car.number;
};

const addUser1andCar1 = async () => {
  await addUser1();
  await addCar1();
};

beforeAll(async () => {
  pay.create.mockResolvedValue({
    id: '100',
  });
});

beforeEach(async () => {
  await User.deleteMany();
  await Car.deleteMany();
  await Parking.deleteMany();
  await Payment.deleteMany();
  user1 = {
    phone: phone1,
  };
  validate1 = {
    code,
  };
  car1 = {
    number: number1,
    nickname: nickname1,
  };
  carData = {};
  parkingData = {
    lat: '1',
    lon: '2',
    cityId: '1',
    cityName: 'a',
    areaId: '2',
    areaName: 'b',
    rateId: '1',
    rateName: 'c',
  };
  payData = {};
});

describe('user login', () => {

  test('Should login new user', async () => {
    var res = await sendLogin(user1).expect(HttpStatus.OK);
    expect(res.body).toHaveProperty('validate.userId');
    expect(res.body).toHaveProperty('validate.validateId');
    const userId = res.body.validate.userId;
    const validateId = res.body.validate.validateId;
    validate1.userId = userId;
    validate1.validateId = validateId;
    res = await sendLoginValidate(validate1).expect(HttpStatus.OK);
    expect(res.body).toHaveProperty('user._id');
    expect(res.body).toHaveProperty('user.phone', user1.phone);
    expect(res.body).toHaveProperty('user.token');
    expect(userId).toEqual(res.body.user._id);
  });

  test('Should create login type validate in db', async () => {
    var res = await sendLogin(user1);
    const userId = res.body.validate.userId;
    const validateId = res.body.validate.validateId;
    validate1.userId = userId;
    validate1.validateId = validateId;
    var user = await User.findById(userId);
    expect(user).not.toBeNull();
    const validates = user.validates;
    expect(validates).toBeDefined();
    expect(validates).toHaveLength(1);
    const loginValidate = validates[0];
    expect(loginValidate).toHaveProperty('type', 'login');
    res = await sendLoginValidate(validate1);
    user = await User.findById(userId);
    expect(user).not.toBeNull();
    expect(user.validates).toHaveLength(0);
  });

  test('Should return existing user with different token', async () => {
    await addUser1();
    const previousToken = user1.token;
    await addUser1();
    expect(previousToken).not.toBe(user1.token);
  });

  test('Should create login validate in db', async () => {
    await addUser1();
    const previousUserId = user1.userId;
    const res = await loginUser1();
    const validateId = res.body.validate.validateId;
    validate1.userId = previousUserId;
    validate1.validateId = validateId;
    await sendLoginValidate(validate1).expect(HttpStatus.OK);
  });

  test('There should be only one kind of login validate type in db', async () => {
    var res = await loginUser1();
    const validateId = res.body.validate.validateId;
    res = await loginUser1();
    expect(validateId).toEqual(res.body.validate.validateId);
  });

  test('Should logout user', async () => {
    await addUser1();
    const res = await sendLogout(user1, user1.token).expect(HttpStatus.OK);
    expect(res.body.user.token).toBeUndefined();
  });
});

describe('car operations', () => {
  beforeEach(async () => {
    await addUser1();
  });

  test('Should add car', async () => {
    carData.userId = user1.userId;
    var res = await sendAdd(carData, user1.token).expect(HttpStatus.OK);
    const validateId = res.body.validate.validateId;
    validate1.userId = user1.userId;
    validate1.number = car1.number;
    validate1.nickname = car1.nickname;
    validate1.validateId = validateId;
    res = await sendAddValidate(validate1, user1.token).expect(HttpStatus.OK);
    car1.carId = res.body.car._id;
    expect(res.body).toHaveProperty('car._id');
    expect(res.body).toHaveProperty('car.car._id');
    expect(res.body).toHaveProperty('car.nickname', nickname1);
    expect(res.body).toHaveProperty('car.car.number', number1);
  });

  test('Should remove car', async () => {
    await addCar1();
    carData.userId = user1.userId;
    carData.carId = car1.carId;
    await sendRemove(carData, user1.token).expect(HttpStatus.OK);
  });

  test('Should not add existing car', async () => {
    await addCar1();
    carData.userId = user1.userId;
    const res = await sendAdd(carData, user1.token);
    const validateId = res.body.validate.validateId;
    validate1.userId = user1.userId;
    validate1.number = car1.number;
    validate1.nickname = car1.nickname;
    validate1.validateId = validateId;
    await sendAddValidate(validate1, user1.token).expect(HttpStatus.BAD_REQUEST);
  });

  test('Should not remove parking car', async () => {
    await addCar1();
    await startParkingUser1();
    carData.userId = user1.userId;
    carData.carId = car1.carId;
    await sendRemove(carData, user1.token).expect(HttpStatus.BAD_REQUEST);
  });

});

describe('parking operations', () => {
  beforeEach(async () => {
    await addUser1andCar1();
  });

  test('Should start parking', async () => {
    const res = await startParkingUser1().expect(HttpStatus.OK);
    expect(res.body).toHaveProperty('parking._id');
    expect(res.body).toHaveProperty('parking.startDate');
  });

  test('Should end parking', async () => {
    var res = await startParkingUser1();
    parkingData.parkingId = res.body.parking._id;
    res = await endParkingUser1().expect(HttpStatus.OK);
    expect(res.body).toHaveProperty('parking._id');
    expect(res.body).toHaveProperty('parking.endDate');
    expect(res.body).toHaveProperty('payment._id');
  });

  test('Should not start parking after existing one', async () => {
    await startParkingUser1().expect(HttpStatus.OK);
    await startParkingUser1().expect(HttpStatus.BAD_REQUEST);
  });

  test('Should not end parking after no parking', async () => {
    const res = await startParkingUser1();
    parkingData.parkingId = res.body.parking._id;
    await endParkingUser1();
    await endParkingUser1().expect(HttpStatus.BAD_REQUEST);
  });

  test('Should request validate after token validation failed', async () => {
    await sendLogout(user1, user1.token).expect(HttpStatus.OK);
    await startParkingUser1().expect(HttpStatus.UNAUTHORIZED);
  });

  test('Should return existing car, parking and payment after login verify', async () => {
    await startAndEndParkUser1();
    const res = await loginAndValidateUser1();
    expect(res.body.user.cars[0].car).toHaveProperty('number');
    expect(res.body).toHaveProperty('user.parking.cityId');
    expect(res.body).toHaveProperty('user.payment.sessionId');
  });

  test('Should be able to pay for ended parking', async () => {
    await startAndEndParkUser1();
    pay.pay.mockResolvedValue({
      userId: user1.userId,
      paymentId: payData.paymentId,
    });
    const res = await paymentUser1().expect(HttpStatus.OK);
    var user = await User.findById(user1.userId);
    expect(user).not.toHaveProperty('parking', 'payment');
  });

});