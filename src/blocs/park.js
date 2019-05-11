const {
  User,
} = require('../models/user');
const Parking = require('../models/parking');
const Car = require('../models/car');

const start = async (data) => {
  const user = data.user;
  if (user.parking) {
    throw new Error();
  }
  const car = user.cars.id(data.carId);
  if (!car) {
    throw new Error();
  }
  const parking = new Parking({
    cityId: data.cityId,
    cityName: data.cityName,
    areaId: data.areaId,
    areaName: data.areaName,
    rateId: data.rateId,
    rateName: data.rateName,
    lat: data.lat,
    lon: data.lon,
    user: user,
    car: car.car
  });
  user.parking = parking._id;
  await parking.save();
  await user.save();
  return await Parking.findById(parking._id);
};

const stop = async (data) => {
  const user = data.user;
  if (!user.parking) {
    throw new Error();
  }
  const parking = await Parking.findById(data.parkingId);
  if (!parking) {
    throw new Error();
  }
  user.parking = undefined;
  await user.save();
  return parking;
};

module.exports = {
  start,
  stop,
};