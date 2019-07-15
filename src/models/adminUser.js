const {
  Schema,
  model
} = require('mongoose');

const AdminUserSchema = new Schema({
  token: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true
});

module.exports = model('AdminUser', AdminUserSchema);