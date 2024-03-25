const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  dueDate: [
    {
      type: String,
      required: true,
    },
  ],
  items: [
    {
      type: String,
      required: true,
    },
  ],
  quantities: [
    {
      type: String,
      required: true,
    },
  ],
  rates: [
    {
      type: String,
      required: true,
    },
  ],
  subTotals: [
    {
      type: String,
      required: true,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
