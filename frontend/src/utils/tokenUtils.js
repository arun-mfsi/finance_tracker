/**
 * Token utility functions for JWT handling
 */

/**
 * Decode JWT token payload without verification
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @param {number} bufferSeconds - Buffer time in seconds before actual expiry (default: 60)
 * @returns {boolean} - True if token is expired or will expire within buffer time
 */
export const isTokenExpired = (token, bufferSeconds = 60) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = decoded.exp;
  
  // Check if token is expired or will expire within buffer time
  return currentTime >= (expirationTime - bufferSeconds);
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

/**
 * Get time until token expires
 * @param {string} token - JWT token
 * @returns {number} - Seconds until expiration, or 0 if expired
 */
export const getTimeUntilExpiration = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = decoded.exp;
  
  return Math.max(0, expirationTime - currentTime);
};

/**
 * Check if token needs refresh
 * @param {string} token - JWT token
 * @param {number} refreshThresholdMinutes - Minutes before expiry to trigger refresh (default: 5)
 * @returns {boolean} - True if token should be refreshed
 */
export const shouldRefreshToken = (token, refreshThresholdMinutes = 5) => {
  const timeUntilExpiration = getTimeUntilExpiration(token);
  const thresholdSeconds = refreshThresholdMinutes * 60;
  
  return timeUntilExpiration > 0 && timeUntilExpiration <= thresholdSeconds;
};
