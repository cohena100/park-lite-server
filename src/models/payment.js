const {
  Schema,
  model
} = require('mongoose');

const PaymentSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  sessionId: {
    type: String,
  },
  parking: {
    type: Schema.Types.ObjectId,
    ref: 'Parking',
  },
}, {
  timestamps: true
});

module.exports = model('Payment', PaymentSchema);