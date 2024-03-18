const express = require('express');
const multer = require('multer');
const storage = require('./../config/cloudinary');

const upload = multer({ storage });

const {
  createBusinessCtrl,
  fetchBusinessesCtrl,
  fetchBusinessCtrl,
  deleteBusinessCtrl,
  businessDetails,
  updateBusinessCtrl,
  getUploadBusinessLogoForm,
  uploadBusinessLogo,
} = require('../controllers/businessCtrl');

const isLoggedIn = require('../middlewares/isLoggedIn');

const businessRouter = express.Router();

// Customers Route
// GET /customers
businessRouter.get('/', isLoggedIn, fetchBusinessesCtrl);

// Create Customers Route
// GET /customers/create-customer
businessRouter.get('/create-business', isLoggedIn, (req, res) => {
  res.render('businesses/createBusiness', { error: '' });
});

// Create Customers Route
// POST /customers/create-customer
businessRouter.post('/create-business', createBusinessCtrl);

// Get single customer route
// GET /customers/customer/:id
businessRouter.get('/business/:id', isLoggedIn, fetchBusinessCtrl);

// Update customers route
// PUT /customers/update-customer/:id
businessRouter.put('/update-business/:id', isLoggedIn, updateBusinessCtrl);

// Delete customer route
// DELETE /customers/delete-customer/:id
businessRouter.delete('/delete-business/:id', isLoggedIn, deleteBusinessCtrl);

// Customer details route
// GET /customers/:id
businessRouter.get('/:id', isLoggedIn, businessDetails);

// Customer details route
// GET /customers/:id
businessRouter.get(
  '/upload-business-logo/:id',
  isLoggedIn,
  getUploadBusinessLogoForm
);

// Customer details route
// GET /customers/:id
businessRouter.put(
  '/upload-business-logo/:id',
  isLoggedIn,
  upload.single('logo'),
  uploadBusinessLogo
);

module.exports = businessRouter;
