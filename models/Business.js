const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  businessLogo: {
    type: String,
    required: true,
  },
  businessAddress: {
    type: String,
    required: true,
  },
  businessPhoneNumber: {
    type: String,
    required: true,
  },
  businessCountry: {
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
