const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  address: {
    type: String,
  },
  otp:{
    type: Number
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
