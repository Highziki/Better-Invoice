const express = require('express');
const {
  registerCtrl,
  loginCtrl,
  userProfileCtrl,
} = require('../controllers/userCtrl');

const isLoggedIn = require('../middlewares/isLoggedIn');

const userRouter = express.Router();

userRouter.get('/register', (req, res) => {
  res.render('users/register', { error: '' });
});

userRouter.post('/register', registerCtrl);

userRouter.get('/login', (req, res) => {
  res.render('users/login', { error: '' });
});

userRouter.post('/login', loginCtrl);

userRouter.get('/profile/:id', isLoggedIn, userProfileCtrl);

module.exports = userRouter;
