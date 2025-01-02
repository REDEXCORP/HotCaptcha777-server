const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      return this.authSource === 'self';
    },
    select: false,
  },
  authSource: {
    type: String,
    enum: ["self", "google"],
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  if (this.authSource === 'self' && this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
