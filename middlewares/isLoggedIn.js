const getToken = require('../utils/getToken');
const verifyToken = require('../utils/verifyToken');

const isLoggedIn = (req, res, next) => {
  const token = getToken(req);
  const verifiedToken = verifyToken(token);
  if (verifiedToken) req.user = verifiedToken;
  else
    return res.render('errorPage', {
      error: 'Invalid/expired token, please log in again',
    });
  next();
};

module.exports = isLoggedIn;
