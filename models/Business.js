const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default:
      'https://cdn5.vectorstock.com/i/1000x1000/77/94/your-logo-here-placeholder-symbol-vector-25817794.jpg',
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
