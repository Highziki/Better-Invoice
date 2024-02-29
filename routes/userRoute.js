const express = require('express');
const {
  registerCtrl,
  loginCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updatePasswordCtrl,
  userDetailsCtrl,
  uploadProfileImage,
  getUpdatePasswordForm,
} = require('../controllers/userCtrl');

const isLoggedIn = require('../middlewares/isLoggedIn');

const userRouter = express.Router();

userRouter.get('/register', (req, res) => {
  res.render('users/register', { error: '', user: '' });
});

userRouter.post('/register', registerCtrl);

userRouter.get('/login', (req, res) => {
  res.render('users/login', { error: '', user: '' });
});

userRouter.get('/upload-user-profile-image', isLoggedIn, (req, res) => {
  res.render('users/uploadProfileImage', { error: '' });
});

userRouter.put(
  '/upload-user-profile-image/:id',
  isLoggedIn,
  uploadProfileImage
);

userRouter.post('/login', loginCtrl);

userRouter.get('/profile/:id', isLoggedIn, userProfileCtrl);

userRouter.put('/user-update/:id', updateUserCtrl);

userRouter.get('/user-update-password/:id', isLoggedIn, getUpdatePasswordForm);

userRouter.put('/user-update-password/:id', isLoggedIn, updatePasswordCtrl);

userRouter.get('/:id', isLoggedIn, userDetailsCtrl);

module.exports = userRouter;
