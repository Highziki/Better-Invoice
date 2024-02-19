const getToken = req => {
  const token = req.cookies.token;
  return token;
};

module.exports = getToken;
