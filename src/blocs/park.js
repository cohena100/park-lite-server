const {
  User,
} = require('../models/user');
const Parking = require('../models/parking');
const Car = require('../models/car');
const geoPark = require('../data/geo_park.json');

const start = async (data) => {
  const user = data.user;
  if (user.parking) {
    throw new Error();
  }
  const car = user.cars.id(data.carId);
  if (!car) {
    throw new Error();
  }
  const city = geoPark.cities.filter((c) => c.id === data.cityId).pop();
  if (!city) {
    throw new Error();
  }
  const area = city.areas.filter((a) => a.id === data.areaId).pop();
  if (!area) {
    throw new Error();
  }
  const rate = area.rates.filter((r) => r.id === data.rateId).pop();
  if (!rate) {
    throw new Error();
  }
  const parking = new Parking({
    cityId: data.cityId,
    cityName: data.cityName,
    areaId: data.areaId,
    areaName: data.areaName,
    rateId: data.rateId,
    rateName: data.rateName,
    ratePrice: rate.price,
    lat: data.lat,
    lon: data.lon,
    user: user.id,
    car: car.car.id,
  });
  user.parking = parking.id;
  await parking.save();
  await user.save();
  return await Parking.findById(parking.id);
};

const end = async (data) => {
  const user = data.user;
  if (!user.parking || user.payment) {
    throw new Error();
  }
  const parking = await Parking.findById(data.parkingId);
  if (!parking) {
    throw new Error();
  }
  parking.endDate = new Date();
  await parking.save();
  return parking;
};

module.exports = {
  start,
  end,
};