const express = require('express');
const {
  createCustomerCtrl,
  fetchCustomersCtrl,
  fetchCustomerCtrl,
  deleteCustomerCtrl,
} = require('../controllers/customerCtrl');
const isLoggedIn = require('../middlewares/isLoggedIn');

const customerRouter = express.Router();

customerRouter.get('/', isLoggedIn, fetchCustomersCtrl);

customerRouter.get('/create-customer', isLoggedIn, (req, res) => {
  res.render('customers/createCustomer', { error: '' });
});

customerRouter.post('/create-customer', createCustomerCtrl);

customerRouter.get('/customer/:id', isLoggedIn, fetchCustomerCtrl);

customerRouter.delete('/delete-customer/:id', isLoggedIn, deleteCustomerCtrl);

module.exports = customerRouter;
