const express = require('express');
const { registerCtrl, loginCtrl } = require('../controllers/userCtrl');

const userRouter = express.Router();

userRouter.get('/register', (req, res) => {
  res.render('users/register', { error: '' });
});

userRouter.post('/register', registerCtrl);

userRouter.get('/login', (req, res) => {
  res.render('users/login', { error: '' });
});

userRouter.post('/login', loginCtrl);

module.exports = userRouter;
