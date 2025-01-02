const mongoose = require('mongoose');

const userOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['userRegister', 'forgotPassword'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  }
});

const UserOtpModel = mongoose.model("userOtp", userOtpSchema);

module.exports = UserOtpModel;