const Customer = require('../models/Customer');

const createCustomerCtrl = async (req, res) => {
  try {
    const { name, address, phoneNumber, country } = req.body;

    if (!name || !address || !phoneNumber || !country)
      return res.render('customers/createCustomer', {
        error: 'All fields are required',
      });

    const customer = await Customer.create({
      name,
      address,
      phoneNumber,
      country,
    });

    console.log(customer);

    res.redirect('/customers');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const fetchCustomersCtrl = async (req, res) => {
  const customers = await Customer.find();

  res.render('customers/customers', { customers });
};

module.exports = { createCustomerCtrl, fetchCustomersCtrl };
