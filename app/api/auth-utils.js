'use strict';

const jwt = require('jsonwebtoken');
const logger = require('simple-node-logger').createSimpleLogger();

let password = require('auth-config').password;

if (process.env.NODE_ENV === 'production') {
  password = process.env.JWT_PASSWORD;
}

const createToken = function (payload) {
  const config = {
    algorithm: 'HS256',
    expiresIn: '1h',
  };
  return jwt.sign(payload, password, config);
};

const decodeToken = function (token) {
  try {
    const decodeResult = jwt.verify(token, password);
    logger.debug('Successfully decoded jwt-token.');
    return decodeResult;
  } catch (error) {
    logger.error('Could not decode jwt-token.', error);
    return error;
  }
};

exports.createToken = createToken;
exports.decodeToken = decodeToken;