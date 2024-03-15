const express = require('express');
const {
  createCustomerCtrl,
  fetchCustomersCtrl,
  fetchCustomerCtrl,
  deleteCustomerCtrl,
  customerDetails,
  updateCustomerCtrl,
} = require('../controllers/customerCtrl');

const isLoggedIn = require('../middlewares/isLoggedIn');

const customerRouter = express.Router();

// Customers Route
// GET /customers
customerRouter.get('/', isLoggedIn, fetchCustomersCtrl);

// Create Customers Route
// GET /customers/create-customer
customerRouter.get('/create-customer', isLoggedIn, (req, res) => {
  res.render('customers/createCustomer', { error: '' });
});

// Create Customers Route
// POST /customers/create-customer
customerRouter.post('/create-customer', createCustomerCtrl);

// Get single customer route
// GET /customers/customer/:id
customerRouter.get('/customer/:id', isLoggedIn, fetchCustomerCtrl);

// Update customers route
// PUT /customers/update-customer/:id
customerRouter.put('/update-customer/:id', isLoggedIn, updateCustomerCtrl);

// Delete customer route
// DELETE /customers/delete-customer/:id
customerRouter.delete('/delete-customer/:id', isLoggedIn, deleteCustomerCtrl);

// Customer details route
// GET /customers/:id
customerRouter.get('/:id', isLoggedIn, customerDetails);

module.exports = customerRouter;
