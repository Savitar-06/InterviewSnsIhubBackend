const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  mobile: String,
  role: { type: String},
  password: String,
});

module.exports = mongoose.model('User', userSchema);
