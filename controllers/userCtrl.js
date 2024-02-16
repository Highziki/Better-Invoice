const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerCtrl = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword)
      return res.render('users/register', {
        error: 'All fields are required!',
      });

    const userFound = await User.findOne({ email });

    if (userFound)
      return res.render('users/register', { error: 'Email already exists!' });

    if (password !== confirmPassword)
      return res.render('users/register', {
        error: 'Passwords do not match!',
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    console.log('User created');
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.render('users/login', {
        error: 'All fields are required!',
      });

    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.render('users/login', {
        error: 'Invalid login credentials!',
      });

    const passwordValid = await bcrypt.compare(password, userFound.password);
    if (!passwordValid)
      return res.render('users/login', {
        error: 'Invalid login credentials!',
      });

    console.log('User logged in');
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registerCtrl, loginCtrl };
