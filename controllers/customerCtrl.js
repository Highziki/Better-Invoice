const User = require('../models/User');
const Customer = require('../models/Customer');

// Create customer controller
const createCustomerCtrl = async (req, res) => {
  try {
    const { name, address, phoneNumber, country } = req.body;

    // Logged in user's id
    const userID = res.locals.user.id;

    // Check if any required fields are empty
    if (!name || !address || !phoneNumber || !country)
      return res.render('customers/createCustomer', {
        error: 'All fields are required',
      });

    // Format country i.e nIGEriA => Nigeria
    const formattedCountry = `${country.toLowerCase()[0].toUpperCase()}${country
      .toLowerCase()
      .slice(1)}`;

    // Create Customer
    const customer = await Customer.create({
      name,
      address,
      phoneNumber,
      country: formattedCountry,
    });

    // Find the logged in user
    const user = await User.findById(userID);

    // Push customer to into user.customer
    user.customers.push(customer._id);

    // Resave the user
    user.save();

    // Redirect to customers page
    res.redirect('/customers');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Fetch all customers controller
const fetchCustomersCtrl = async (req, res) => {
  try {
    // Logged in user's id
    const userID = res.locals.user.id;

    // Find the user and populate the customers
    const user = await User.findById(userID).populate('customers');

    // Render the customers page
    res.render('customers/customers', { user });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Fetch single customer controller
const fetchCustomerCtrl = async (req, res) => {
  try {
    const customerID = req.params.id; // Customer id
    const userID = res.locals.user.id; // Logged in user id

    // Find the logged in user
    const user = await User.findById(userID);

    const customers = [];

    // Convert customer ids from mongodb object to strings and push to new array
    user.customers.forEach(customer => customers.push(customer.toString()));

    // Check if params (customer id) is valid
    if (!customers.includes(customerID))
      return res.render('errorPage', { error: '404. Not found' });

    // Find customer
    const customer = await Customer.findById(customerID);

    // Render customerDetails page
    res.render('customers/customerDetails', { customer });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Customer details controller
const customerDetails = async (req, res) => {
  try {
    const customerID = req.params.id; // Customer id
    const userID = res.locals.user.id; // Logged in user id

    // Find the logged in user
    const user = await User.findById(userID);

    const customers = [];

    // Convert customer ids from mongodb object to strings and push to new array
    user.customers.forEach(customer => customers.push(customer.toString()));

    // Check if params (customer id) is valid
    if (!customers.includes(customerID))
      return res.render('errorPage', { error: '404. Not found' });

    // Find customer
    const customer = await Customer.findById(customerID);

    // Render Update customer page
    res.render('customers/updateCustomer', { customer, error: '' });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Update customer controller
const updateCustomerCtrl = async (req, res) => {
  try {
    const { name, address, country, phoneNumber } = req.body;

    const customerID = req.params.id; // Customer id

    // Check if any required fields are empty
    if (!name || !address || !phoneNumber || !country)
      return res.render('customers/updateCustomer', {
        error: 'All fields are required',
      });

    // Format country i.e nIGEriA => Nigeria
    const formattedCountry = `${country.toLowerCase()[0].toUpperCase()}${country
      .toLowerCase()
      .slice(1)}`;

    // Find and update customer
    const customer = await Customer.findByIdAndUpdate(customerID, {
      name,
      address,
      country: formattedCountry,
      phoneNumber,
    });

    // Resave customer
    customer.save();

    // Redirect to customerDetails page
    res.redirect(`/customers/customer/${customer._id}`);
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Delete customer controller
const deleteCustomerCtrl = async (req, res) => {
  try {
    const userID = res.locals.user.id; // Logged in user id
    const customerID = req.params.id; // Customer id

    // Find the logged in user
    const user = await User.findById(userID);

    // Find and delete customer
    await Customer.findByIdAndDelete(customerID);

    // Remove customer from user.customers' array
    user.customers.splice(
      user.customers.findIndex(customer => customer === customerID)
    );

    // Resave user
    user.save();

    // Redirect to customers page
    res.redirect('/customers');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

module.exports = {
  createCustomerCtrl,
  fetchCustomersCtrl,
  fetchCustomerCtrl,
  deleteCustomerCtrl,
  customerDetails,
  updateCustomerCtrl,
};
