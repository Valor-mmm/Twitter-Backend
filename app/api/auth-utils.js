'use strict';

const jwt = require('jsonwebtoken');
const logger = require('simple-node-logger').createSimpleLogger();

const apiUtils = require('./api-utils');

let password = require('./auth-config').password;

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


const authenticate = async function(modelName, model, conditions, password) {
  try {
    const foundObject = await apiUtils.findOne(modelName, model, conditions);
    if (foundObject && foundObject.password && foundObject.password === password) {
      return true;
    }
    logger.warn('No object found matching conditions and password.');
    return false;
  } catch(error) {
    logger.error('Error during authentication', error);
    return false;
  }
};


exports.createToken = createToken;
exports.decodeToken = decodeToken;
exports.authenticate = authenticate;