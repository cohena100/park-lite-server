const {
  Schema,
  model
} = require('mongoose');

const CarSchema = new Schema({
  number: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true
});

module.exports = model('Car', CarSchema);