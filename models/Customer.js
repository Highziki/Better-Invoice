const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerPhoneNumber: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
  },
  customerCountry: {
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
