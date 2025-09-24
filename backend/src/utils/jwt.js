import jwt from 'jsonwebtoken';

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || 'super-secret-finance-tracker-key';

  // Only warn once when JWT functions are actually used
  if (!process.env.JWT_SECRET && !getJWTSecret._warned) {
    console.warn(
      'Warning: JWT_SECRET not found in environment variables, using fallback'
    );
    getJWTSecret._warned = true;
  }

  return secret;
};

/**
 * Generate JWT access token for user
 * @param {Object} payload - User data to include in token
 * @returns {string} JWT access token
 */
export const generateAccessToken = payload => {
  const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '60m';
  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
};

/**
 * Generate JWT refresh token for user
 * @param {Object} payload - User data to include in token
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = payload => {
  const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '1d';
  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = token => {
  try {
    return jwt.verify(token, getJWTSecret());
  } catch {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate token for user authentication
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
export const generateAuthTokens = user => {
  const payload = {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user._id });

  return { accessToken, refreshToken };
};
