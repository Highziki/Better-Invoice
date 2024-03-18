const User = require('../models/User');
const Business = require('../models/Business');

// Create customer controller
const createBusinessCtrl = async (req, res) => {
  try {
    const { name, address, phoneNumber, country } = req.body;

    // Logged in user's id
    const userID = res.locals.user.id;

    // Check if any required fields are empty
    if (!name || !address || !phoneNumber || !country)
      return res.render('businesses/createBusiness', {
        error: 'All fields are required',
      });

    // Format country i.e nIGEriA => Nigeria
    const formattedCountry = `${country.toLowerCase()[0].toUpperCase()}${country
      .toLowerCase()
      .slice(1)}`;

    // Create Customer
    const business = await Business.create({
      name,
      address,
      phoneNumber,
      country: formattedCountry,
    });

    // Find the logged in user
    const user = await User.findById(userID);

    // Push business to into user.business
    user.businesses.push(business._id);

    // Resave the user
    user.save();

    // Redirect to customers page
    res.redirect('/businesses');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Fetch all customers controller
const fetchBusinessesCtrl = async (req, res) => {
  try {
    // Logged in user's id
    const userID = res.locals.user.id;

    // Find the user and populate the customers
    const user = await User.findById(userID).populate('businesses');

    // Render the customers page
    res.render('businesses/business', { user });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Fetch single customer controller
const fetchBusinessCtrl = async (req, res) => {
  try {
    const businessID = req.params.id; // Customer id
    const userID = res.locals.user.id; // Logged in user id

    const user = await User.findById(userID);

    const businesses = [];

    // Convert customer ids from mongodb object to strings and push to new array
    user.businesses.forEach(business => businesses.push(business.toString()));

    // Check if params (customer id) is valid
    if (!businesses.includes(businessID))
      return res.render('errorPage', { error: '404. Not found' });

    // Find customer
    const business = await Business.findById(businessID);

    // Render businessDetails page
    res.render('businesses/businessDetails', { business });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Customer details controller
const businessDetails = async (req, res) => {
  try {
    const businessID = req.params.id; // Customer id
    const userID = res.locals.user.id; // Logged in user id

    const user = await User.findById(userID);

    const businesses = [];

    // Convert customer ids from mongodb object to strings and push to new array
    user.businesses.forEach(business => businesses.push(business.toString()));

    // Check if params (customer id) is valid
    if (!businesses.includes(businessID))
      return res.render('errorPage', { error: '404. Not found' });

    // Find customer
    const business = await Business.findById(businessID);

    // Render Update customer page
    res.render('businesses/updateBusiness', { business, error: '' });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Update customer controller
const updateBusinessCtrl = async (req, res) => {
  try {
    const { name, address, country, phoneNumber } = req.body;

    const businessID = req.params.id; // Customer id

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
    const business = await Business.findByIdAndUpdate(businessID, {
      name,
      address,
      country: formattedCountry,
      phoneNumber,
    });

    // Resave customer
    business.save();

    // todo Redirect to businessDetails page
    res.redirect(`/businesses/business/${business._id}`);
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Delete customer controller
const deleteBusinessCtrl = async (req, res) => {
  try {
    const userID = res.locals.user.id; // Logged in user id
    const businessID = req.params.id; // Customer id

    // Find the logged in user
    const user = await User.findById(userID);

    // Find and delete customer
    await Business.findByIdAndDelete(businessID);

    // Remove customer from user.customers' array
    user.businesses.splice(
      user.businesses.findIndex(business => business === businessID)
    );

    // Resave user
    user.save();

    // Redirect to customers page
    res.redirect('/businesses');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const getUploadBusinessLogoForm = async (req, res) => {
  const businessID = req.params.id; // Customer id

  const userID = res.locals.user.id; // Logged in user id

  const user = await User.findById(userID);

  const businesses = [];

  // Convert customer ids from mongodb object to strings and push to new array
  user.businesses.forEach(business => businesses.push(business.toString()));

  // Check if params (customer id) is valid
  if (!businesses.includes(businessID))
    return res.render('errorPage', { error: '404. Not found' });

  const business = await Business.findById(businessID);

  return res.render('businesses/uploadBusinessLogo', { error: '', business });
};

// Upload business logo
const uploadBusinessLogo = async (req, res) => {
  try {
    const businessID = req.params.id; // Customer id
    const userID = res.locals.user.id; // Logged in user id

    const { file } = req;

    const user = await User.findById(userID);

    const businesses = [];

    // Convert customer ids from mongodb object to strings and push to new array
    user.businesses.forEach(business => businesses.push(business.toString()));

    // Check if params (customer id) is valid
    if (!businesses.includes(businessID))
      return res.render('errorPage', { error: '404. Not found' });

    // Check if there is no file
    if (!file)
      return res.render('businesses/uploadBusinessLogo', {
        error: 'All fields are required',
        business: '',
      });

    // Update user
    const business = await Business.findByIdAndUpdate(businessID, {
      logo: file.path,
    });

    // Save user
    business.save();

    // Redirect to profile page
    res.redirect(`/businesses/business/${business._id}`);
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

module.exports = {
  createBusinessCtrl,
  fetchBusinessCtrl,
  fetchBusinessesCtrl,
  deleteBusinessCtrl,
  businessDetails,
  updateBusinessCtrl,
  getUploadBusinessLogoForm,
  uploadBusinessLogo,
};
