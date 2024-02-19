const jwt = require('jsonwebtoken');

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 24,
  });
};

module.exports = generateToken;
