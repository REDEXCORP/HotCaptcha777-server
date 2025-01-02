const jwt = require('jsonwebtoken');

const authTokenAndUserIdValidator = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token not found.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    const userIdFromHeader = req.headers['x-user-id'];

    if (!userIdFromHeader) {
      return res.status(400).json({ message: 'User ID missing in headers.' });
    }

    if (userIdFromHeader !== decoded.userId) {
      return res.status(403).json({ message: 'User ID mismatch, Refresh the page.' });
    }

    req.tokenUser = decoded;

    next();
  });
};

module.exports = authTokenAndUserIdValidator;
