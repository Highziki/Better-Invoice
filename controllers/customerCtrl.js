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

const fetchCustomerCtrl = async (req, res) => {
  try {
    const customerID = req.params.id;

    const customer = await Customer.findById(customerID);

    res.render('customers/customerDetails', { customer });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const deleteCustomerCtrl = async (req, res) => {
  try {
    const customerID = req.params.id;

    await Customer.findByIdAndDelete(customerID);

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
};
