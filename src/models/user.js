const {
  Schema,
  model
} = require('mongoose');

const ValidateSchema = new Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true
});

const UserSchema = new Schema({
  token: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  validates: [ValidateSchema],
  cars: [{
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
  }],
  parking: {
    type: Schema.Types.ObjectId,
    ref: 'Parking',
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
  },
}, {
  timestamps: true
});

UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.validates;
  return obj;
};

module.exports = {
  User: model('User', UserSchema),
  Validate: model('Validate', ValidateSchema),
};