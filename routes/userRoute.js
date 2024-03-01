const express = require('express');
const multer = require('multer');
const storage = require('./../config/cloudinary');
const upload = multer({ storage });

const {
  registerCtrl,
  loginCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updatePasswordCtrl,
  userDetailsCtrl,
  uploadProfileImage,
  getUpdatePasswordForm,
  logoutCtrl,
} = require('../controllers/userCtrl');

const isLoggedIn = require('../middlewares/isLoggedIn');

const userRouter = express.Router();

// Register Route
// GET /users/register
userRouter.get('/register', (req, res) => {
  res.render('users/register', { error: '', user: '' });
});

// Register Route
// POST /users/register
userRouter.post('/register', registerCtrl);

// Login Route
// GET /users/login
userRouter.get('/login', (req, res) => {
  res.render('users/login', { error: '', user: '' });
});

// Login Route
// POST /users/login
userRouter.post('/login', loginCtrl);

// Login Route
// GET /users/logout
userRouter.get('/logout', isLoggedIn, logoutCtrl);

// Upload Profile Image Route
// GET /users//upload-user-profile-image
userRouter.get('/upload-user-profile-image', isLoggedIn, (req, res) => {
  res.render('users/uploadProfileImage', { error: '' });
});

// Upload Profile Image Route
// PUT /users//upload-user-profile-image/:id
userRouter.put(
  '/upload-user-profile-image/:id',
  isLoggedIn,
  upload.single('profile'),
  uploadProfileImage
);

// Profile Route
// GET /users/profile/:id
userRouter.get('/profile/:id', isLoggedIn, userProfileCtrl);

// User Update Route
// PUT /users/user-update/:id
userRouter.put('/user-update/:id', isLoggedIn, updateUserCtrl);

// Password Update Route
// GET /users/user-update-password/:id
userRouter.get('/user-update-password/:id', isLoggedIn, getUpdatePasswordForm);

// User Update Route
// PUT /users/user-update-password/:id
userRouter.put('/user-update-password/:id', isLoggedIn, updatePasswordCtrl);

// User Detai;s Route
// GET /users/:id
userRouter.get('/:id', isLoggedIn, userDetailsCtrl);

module.exports = userRouter;
