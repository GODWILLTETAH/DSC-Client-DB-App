const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },

    count: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Clients', clientSchema);
