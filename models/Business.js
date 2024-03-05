const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  invoices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
  ],
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
