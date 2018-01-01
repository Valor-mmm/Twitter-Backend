'use strict';

const jwt = require('jsonwebtoken');
const logger = require('simple-node-logger').createSimpleLogger();

const apiUtils = require('./api-utils');

/*
  Will be filled through registerForValidation function.
  This object is a map of model names and functions for validation
  functions have to have exactly one parameters: decoded
  functions have to return a boolean if the decoded object is valid
 */
const validators = {};

const getAuthConfig = function () {
  let authConfig = require('./auth-config');

  if (process.env.NODE_ENV === 'production') {
    authConfig = {
      password: process.env.JWT_PASSWORD,
      algorithm: process.env.JWT_ALGORITHM,
      expiresIn: process.env.JWT_EXPIRES_IN
    };
  }

  return authConfig;
};

const authConfig = getAuthConfig();

const createToken = function (payload) {
  const config = {
    algorithm: authConfig.algorithm,
    expiresIn: authConfig.expiresIn,
  };
  return jwt.sign(payload, authConfig.password, config);
};

const decodeToken = function (token) {
  try {
    const decodeResult = jwt.verify(token, authConfig.password);
    logger.debug('Successfully decoded jwt-token.');
    return decodeResult;
  } catch (error) {
    logger.error('Could not decode jwt-token.', error);
    return error;
  }
};


const authenticate = async function (modelName, model, conditions, password) {
  try {
    const foundObject = await apiUtils.findOne(modelName, model, conditions);
    if (foundObject && foundObject.password && foundObject.password === password) {
      return {success: true, id: foundObject._id};
    }
    logger.warn('No object found matching conditions and password.');
    return {success: false};
  } catch (error) {
    logger.error('Error during authentication', error);
    return {success: false};
  }
};


const validate = async function (request, token, h) {
  for (const modelName in validators) {
    if (validators.hasOwnProperty(modelName) && token.decodedJWT.modelName === modelName) {
      const isValid = await validators[modelName](token.decodedJWT);
      return {isValid: isValid, credentials: token.decodedJWT};
    }
  }
  const errMessage = `No validator found for model name [${token.decodedJWT.modelname}]`;
  logger.error(errMessage, Object.keys(validators));
  return {isValid: false, credentials: token.decodedJWT};
};


const registerForValidation = function (modelName, validationFunction) {
  validators[modelName] = validationFunction;
};


exports.getJwtConfig = getAuthConfig;
exports.createToken = createToken;
exports.decodeToken = decodeToken;
exports.authenticate = authenticate;
exports.validate = validate;
exports.registerForValidation = registerForValidation;