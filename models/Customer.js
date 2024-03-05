const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
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

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
