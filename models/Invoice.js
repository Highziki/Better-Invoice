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
  dueDate: {
    type: String,
    default: '15 days',
  },
  items: [
    {
      type: String,
      required: true,
    },
  ],
  quantities: [
    {
      type: Number,
      required: true,
    },
  ],
  rates: [
    {
      type: Number,
      required: true,
    },
  ],
  subTotals: [
    {
      type: Number,
      required: true,
    },
  ],
  subTotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
