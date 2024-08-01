const jwtHelper = require('../../helpers/jwt');

const authMiddleware = (req, res, next) => {
  // Extract token from request headers
  const token = req.headers.authorization;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    // Verify the token
    const decoded = jwtHelper.verifyJwt(token);

    // Check if token is valid
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach the user ID to the request for later use
    req.userId = decoded.id;

    // Call next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
