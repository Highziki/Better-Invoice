const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const {
  getCreateInvoiceFormCtrl,
  fetchInvoicesCtrl,
  createInvoiceCtrl,
} = require('../controllers/invoiceCtrl');

const invoiceRouter = express.Router();

invoiceRouter.get('/', isLoggedIn, fetchInvoicesCtrl);

invoiceRouter.get('/create-invoice', isLoggedIn, getCreateInvoiceFormCtrl);

invoiceRouter.post('/create-invoice', isLoggedIn, createInvoiceCtrl);

module.exports = invoiceRouter;
