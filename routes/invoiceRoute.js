const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const {
  getCreateInvoiceFormCtrl,
  fetchInvoicesCtrl,
  createInvoiceCtrl,
  fetchInvoiceCtrl,
  invoiceDetailsCtrl,
  updateInvoiceCtrl,
  deleteInvoiceCtrl,
} = require('../controllers/invoiceCtrl');

const invoiceRouter = express.Router();

invoiceRouter.get('/', isLoggedIn, fetchInvoicesCtrl);

invoiceRouter.get('/create-invoice', isLoggedIn, getCreateInvoiceFormCtrl);

invoiceRouter.post('/create-invoice', isLoggedIn, createInvoiceCtrl);

invoiceRouter.get('/invoice/:id', isLoggedIn, fetchInvoiceCtrl);

invoiceRouter.put('/update-invoice/:id', isLoggedIn, updateInvoiceCtrl);

invoiceRouter.delete('/delete-invoice/:id', isLoggedIn, deleteInvoiceCtrl);

invoiceRouter.get('/:id', isLoggedIn, invoiceDetailsCtrl);

module.exports = invoiceRouter;
