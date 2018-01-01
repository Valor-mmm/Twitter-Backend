'use strict';

const Joi = require('joi');
const _ = require('lodash');
const logger = require('simple-node-logger').createSimpleLogger();

const User = require('../../models/user/user');
const apiUtils = require('../api-utils');
const validationUtils = require('../validation-utils');
const authUtils = require('../auth-utils');

const modelName = 'User';

const getUserProperties = function (required) {
  const baseObject = {
    tweets: Joi.array().items(Joi.string()),
    following: Joi.array().items(Joi.string()),
  };

  if (required) {
    return _.merge(baseObject, {
      username: Joi.string().required(required),
      email: Joi.string().required(required),
      password: Joi.string().required(required),
      firstName: Joi.string().required(required),
      lastName: Joi.string().required(required),
    });
  }

  return _.merge(baseObject, {
    username: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
  });
};


const authenticate = {

  auth: false,

  validate: {

    payload: {
      email: Joi.string().required(),
      password: Joi.string().required()
    },

    failAction: validationUtils.validationErrHandler
  },

  handler: (request, h) => {
    const password = request.payload.password;
    const email = request.payload.email;
    const conditions = {
      email: email
    };

    return authenticateUser(conditions, password, h);
  }
};

const create = {
  auth: false,

  validate: {
    payload: getUserProperties(true),

    failAction: validationUtils.validationErrHandler
  },

  handler: (request) => {
    return apiUtils.create(modelName, request.payload, User);
  }
};

const getOne = {
  auth: false,

  // TODO add validation:validate: validationUtils.getIdParamsValidation(),

  handler: (request) => {
    return apiUtils.findById(modelName, User, request.params.id);
  }
};

const getSomeById = {
  //auth: false,

  // TODO add validation: validate: validationUtils.getIdArrayValidation(),

  handler: (request) => {
    let query = request.query;
    query = apiUtils.convertQueryString(query);
    let constraints;
    logger.info('Query: ', query);
    if (query.ids) {
      constraints = {
        _id: {$in: query.ids}
      };
    }

    return apiUtils.find(modelName, User, constraints ? constraints : null);
  }
};

const update = {
  auth: false,

  validate: {

    payload: getUserProperties(false),

    params: {
      id: validationUtils.idSchema()
    },

    failAction: validationUtils.validationErrHandler
  },

  handler: (request) => {
    return apiUtils.update(modelName, User, request.params.id, request.payload);
  }
};

const deleteOne = {
  auth: false,

  validate: validationUtils.getIdParamsValidation(),

  handler: (request) => {
    const constraints = {
      _id: request.params.id
    };
    return apiUtils.delete(modelName, User, constraints);
  }
};

const deleteSomeById = {
  auth: false,

  validate: validationUtils.getIdArrayValidation(),

  handler: (request) => {
    let constraints;
    let query = apiUtils.convertQueryString(request.query);
    if (query.ids) {
      constraints = {
        _id: {$in: query.ids}
      };
    }

    return apiUtils.delete(modelName, User, constraints);
  }
};


const authenticateUser = async function(conditions, password, h) {
  const authResult = await authUtils.authenticate(modelName, User, conditions, password);
  if (!authResult.success) {
    return h.response(
      {success: false, message: 'Authentication failed. User not found.'}).code(201);
  }

  const payload = {
    id: authResult.id,
    modelName: modelName,
    email: conditions.email
  };
  const token = authUtils.createToken(payload);
  return h.response({success: true, token: token}).code(201);
};


const validateUserToken = async function (decoded) {
  const constraints = {
    _id: decoded.id,
    email: decoded.email
  };

  let queryResult = await apiUtils.findOne(modelName, User, constraints);
  if (queryResult && queryResult._doc) {
    queryResult = queryResult._doc;
  }
  return (queryResult && queryResult._id && queryResult._id.toString() === decoded.id);
};
authUtils.registerForValidation(modelName, validateUserToken);


exports.authenticate = authenticate;
exports.create = create;
exports.getOne = getOne;
exports.getSomeById = getSomeById;
exports.update = update;
exports.deleteOne = deleteOne;
exports.deleteSomeById = deleteSomeById;