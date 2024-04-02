const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Register Controller
const registerCtrl = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Check if any required fileds are empty
    if (!fullName || !email || !password || !confirmPassword)
      return res.render('users/register', {
        error: 'All fields are required!',
        user: '',
      });

    // Check database for email
    const userFound = await User.findOne({ email });

    // Check if email exists
    if (userFound)
      return res.render('users/register', {
        error: 'Email already exists!',
        user: '',
      });

    // Check if passwords match
    if (password !== confirmPassword)
      return res.render('users/register', {
        error: 'Passwords do not match!',
        user: '',
      });

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Redirect to home page
    res.redirect('/users/login');
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Login Controller
const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if any required fileds are empty
    if (!email || !password)
      return res.render('users/login', {
        error: 'All fields are required!',
        user: '',
      });

    // Check database for email
    const userFound = await User.findOne({ email });

    // Check if email does not exist
    if (!userFound)
      return res.render('users/login', {
        error: 'Invalid login credentials!',
        user: '',
      });

    // Compare encrypted password and inputed password
    const passwordValid = await bcrypt.compare(password, userFound.password);

    // Check if password is not valid
    if (!passwordValid)
      return res.render('users/login', {
        error: 'Invalid login credentials!',
        user: '',
      });

    // Generate token for user
    generateToken(userFound._id, res);

    // Redirect to profile page
    res.redirect(`/users/profile/${userFound._id}`);
  } catch (error) {
    res.render('errorPage', { error: error.message });
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

let params = [];

// Profile Controller
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

// Details Controller
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

// Update User Controller
const updateUserCtrl = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const userID = res.locals.user.id;

    // Check if required fields are empty
    if (!fullName || !email)
      return res.render('users/updateUser', {
        error: 'All fields are required',
      });

    // Check database for email
    const emailExists = await User.findOne({ email });

    // Check if email exists and belongs to another user
    if (emailExists && emailExists._id.toString() !== userID)
      return res.render('users/updateUser', {
        error: 'Email already exists!',
      });

    // Update user
    const user = await User.findByIdAndUpdate(userID, { fullName, email });

    // Save user
    user.save();

    // Redirect to profile page
    res.redirect(`/users/profile/${user._id}`);
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Get Update Password Form Controller
const getUpdatePasswordForm = async (req, res) => {
  try {
    const curParams = req.params.id;

    const initialParams = params[0];

    params.push(curParams);
    if (initialParams !== curParams)
      return res.render('errorPage', { error: '404. Not Found' });

    res.render('users/updatePassword', { error: '' });
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Update Password Controller
const updatePasswordCtrl = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const userID = res.locals.user.id;

    const curParams = req.params.id;
    params.push(curParams);

    const initialParams = params[0];

    if (initialParams !== curParams)
      return res.render('errorPage', { error: '404. Not Found' });

    // Check if required fields are empty
    if (!newPassword || !confirmPassword)
      return res.render('users/updatePassword', {
        error: 'All fields are required',
      });

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    const user = await User.findByIdAndUpdate(userID, {
      password: hashedPassword,
    });

    // Save user
    user.save();

    // Redirect to profile page
    res.redirect(`/users/profile/${user?.id}`);
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Upload Profile Image Controller
const uploadProfileImage = async (req, res) => {
  try {
    const { file } = req;
    const userID = res.locals.user.id;

    // Check if there is no file
    if (!file)
      return res.render('users/uploadProfileImage', {
        error: 'All fields are required',
      });

    // Update user
    const user = await User.findByIdAndUpdate(userID, {
      profileImage: file.path,
    });

    // Save user
    user.save();

    // Redirect to profile page
    res.redirect(`/users/profile/${user._id}`);
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

// Logout Controller
const logoutCtrl = async (req, res) => {
  try {
    res.clearCookie('token');
    res.redirect('/users/login');
    params = [];
  } catch (error) {
    res.render('errorPage', { error: error.message });
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updatePasswordCtrl,
  userDetailsCtrl,
  uploadProfileImage,
  getUpdatePasswordForm,
  logoutCtrl,
};
