const crypto = require('crypto');

/**
 * Generates a secure random token.
 * @param {number} length - Length of the token in bytes.
 * @returns {string} - Hexadecimal token string.
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Example usage:
const token = generateToken();
console.log('Generated Token:', token);

module.exports = generateToken;