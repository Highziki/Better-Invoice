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

// Business Route
// GET /businesses
businessRouter.get('/', isLoggedIn, fetchBusinessesCtrl);

// Create Business Route
// GET /businesses/create-business
businessRouter.get('/create-business', isLoggedIn, (req, res) => {
  res.render('businesses/createBusiness', { error: '' });
});

// Create Business Route
// POST /businesses/create-business
businessRouter.post('/create-business', createBusinessCtrl);

// Get single business route
// GET /businesses/business/:id
businessRouter.get('/business/:id', isLoggedIn, fetchBusinessCtrl);

// Update business route
// PUT /businesses/update-business/:id
businessRouter.put('/update-business/:id', isLoggedIn, updateBusinessCtrl);

// Delete business route
// DELETE /businesses/delete-business/:id
businessRouter.delete('/delete-business/:id', isLoggedIn, deleteBusinessCtrl);

// Business details route
// GET /businesses/:id
businessRouter.get('/:id', isLoggedIn, businessDetails);

// Upload business logo route
// GET /businesses/upload-business-logo/:id
businessRouter.get(
  '/upload-business-logo/:id',
  isLoggedIn,
  getUploadBusinessLogoForm
);

// Upload business logo route
// GET /businesses/upload-business-logo/:id
businessRouter.put(
  '/upload-business-logo/:id',
  isLoggedIn,
  upload.single('logo'),
  uploadBusinessLogo
);

module.exports = businessRouter;
