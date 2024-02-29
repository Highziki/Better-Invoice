const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

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

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

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

    generateToken(userFound._id, res);
    res.redirect(`/users/profile/${userFound._id}`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Since tailwind seems to be interferring
 * with the params, a walk-around became necessary.
 *
 * The first element of the params array (params[0]) is the user
 * id while the second element turns out to be styles.css for
 * some reason.
 *
 * The curParams is the current params which will be updated if the
 * page is reloaded. If the current params (curParams) does not match
 * the user id (intialParams), an error 404 will the sent to
 * the views.
 */

const params = [];

const userProfileCtrl = async (req, res) => {
  try {
    const userID = res.locals.user.id;

    const curParams = req.params.id;
    params.push(curParams);

    const initialParams = params[0];

    if (initialParams !== curParams)
      return res.render('errorPage', { error: '404. Not Found' });

    const user = await User.findById(userID);

    res.render('users/profile', { user });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const userDetailsCtrl = async (req, res) => {
  try {
    const userID = res.locals.user.id;

    const curParams = req.params.id;
    params.push(curParams);

    const initialParams = params[0];

    const user = await User.findById(userID);

    if (initialParams !== curParams)
      return res.render('errorPage', { error: '404. Not Found' });

    res.render('users/updateUser', { user, error: '' });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

const updateUserCtrl = async (req, res) => {
  const userID = res.locals.user.id;

  // const user = await User.findById(userID);
};

const getUpdatePasswordForm = async (req, res) => {
  const curParams = req.params.id;

  const initialParams = params[0];

  params.push(curParams);
  if (initialParams !== curParams)
    return res.render('errorPage', { error: '404. Not Found' });

  res.render('users/updatePassword', { error: '' });
};

const updatePasswordCtrl = async (req, res) => {
  const userID = res.locals.user.id;

  const curParams = req.params.id;
  params.push(curParams);

  const initialParams = params[0];

  if (initialParams !== curParams)
    return res.render('errorPage', { error: '404. Not Found' });

  const user = await User.findById(userID);
};

const uploadProfileImage = async (req, res) => {};

module.exports = {
  registerCtrl,
  loginCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updatePasswordCtrl,
  userDetailsCtrl,
  uploadProfileImage,
  getUpdatePasswordForm,
};
