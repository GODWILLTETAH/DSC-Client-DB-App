const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Location', locationSchema);
