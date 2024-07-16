const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET;
const DEFAULT_TOKEN_EXPIRY = '14d';
const JWT_AUDIENCE = 'localhost:3000';
const JWT_ISSUER = 'localhost:3000';

const handleError = (error) => {
  console.error('Error:', error.message);
  return null;
};

const signJwt = (payload) => {
  if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }

  try {
    return jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_TTL || DEFAULT_TOKEN_EXPIRY, audience: JWT_AUDIENCE, issuer: JWT_ISSUER
    });
  } catch (error) {
    return handleError(error);
  }
};

const verifyJwt = (token) => {
  if (!JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }

  try {
    if (!token.startsWith('Bearer ')) {
      throw new Error('Invalid token format');
    }

    const tokenWithoutBearer = token.replace(/^Bearer\s/, '');
    return jwt.verify(tokenWithoutBearer, JWT_SECRET_KEY, {
      audience: JWT_AUDIENCE, issuer: JWT_ISSUER
    });
  } catch (error) {
    return handleError(error);
  }
};

module.exports = {
  signJwt, verifyJwt
};
