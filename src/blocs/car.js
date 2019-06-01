const {
  Status
} = require('./status');
const {
  User,
  Validate,
} = require('../models/user');
const {
  pushValidate,
  pullValidate,
  checkValidate,
} = require('./helpers');
const Parking = require('../models/parking');
const Car = require('../models/car');

const add = async (data) => {
  const user = data.user;
  const validate = pushValidate(user, 'car');
  await user.save();
  return {
    status: Status.success,
    validateId: validate._id,
  };
};

const addValidate = async (data) => {
  const user = data.user;
  if (!checkValidate(user, data.validateId)) {
    throw new Error();
  }
  const foundCars = user.cars.filter(car => car.car.number === data.number);
  if (foundCars.length === 1) {
    throw new Error();
  }
  const query = {
    number: data.number
  };
  const update = {
    number: data.number
  };
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };
  const car = await Car.findOneAndUpdate(query, update, options);
  user.cars.push({
    car,
    nickname: data.nickname
  });
  pullValidate(user, data.validateId);
  await user.save();
  return {
    status: Status.success,
    car: user.cars[user.cars.length - 1],
  };
};

const remove = async (data) => {
  const user = data.user;
  const foundCar = user.cars.id(data.carId);
  if (!foundCar) {
    throw new Error();
  }
  if (user.parking && user.parking.car.equals(foundCar.car.id)) {
    throw new Error();
  }
  foundCar.remove();
  await user.save();
  return foundCar;
};

module.exports = {
  add,
  addValidate,
  remove,
};