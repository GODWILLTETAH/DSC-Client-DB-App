const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'editor', 'moderator', 'guest'],
      default: 'user',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
