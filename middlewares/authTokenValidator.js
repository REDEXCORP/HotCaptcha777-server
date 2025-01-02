const jwt = require('jsonwebtoken');


const authTokenValidator = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token not found.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    req.tokenUser = decoded;
    next();
  });
};

module.exports = authTokenValidator;
