const {
  Schema,
  model
} = require('mongoose');

const ParkingSchema = new Schema({
  cityId: {
    type: String,
    required: true,
    trim: true,
  },
  cityName: {
    type: String,
    required: true,
    trim: true,
  },
  areaId: {
    type: String,
    required: true,
    trim: true,
  },
  areaName: {
    type: String,
    required: true,
    trim: true,
  },
  rateId: {
    type: String,
    required: true,
    trim: true,
  },
  rateName: {
    type: String,
    required: true,
    trim: true,
  },
  ratePrice: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  lat: {
    type: String,
    required: true,
    trim: true,
  },
  lon: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
  },
}, {
  timestamps: true
});

module.exports = model('Parking', ParkingSchema);