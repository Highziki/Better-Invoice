const jwt = require('jsonwebtoken');

const verifyToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) return;
    return data;
  });
};

module.exports = verifyToken;
