'use strict';

const Joi = require('joi');

const User = require('../models/user/user');
const apiUtils = require('./api-utils');
const validationUtils = require('./validation-utils');

const modelName = 'User';

const getUserProperties = function (required) {
  return {
    username: Joi.string().required(required),
    email: Joi.string().required(required),
    password: Joi.string().required(required),
    firstName: Joi.string().required(required),
    lastName: Joi.string().required(required),
    tweets: Joi.array().items(Joi.string()),
    following: Joi.array().items(Joi.string()),
    _id: validationUtils.idSchema()
  };
};

const create = {
  auth: false,

  validate: {
    payload: getUserProperties(true),

    failAction: validationUtils.validationErrHandler
  },

  handler: (request, h) => {
    return apiUtils.create(modelName, request.payload, User);
  }
};

const getOne = {
  auth: false,

  // TODO add validation:validate: validationUtils.getIdParamsValidation(),

  handler: (request, h) => {
    return apiUtils.findById(modelName, User, request.params.id);
  }
};

const getSomeById = {
  auth: false,

  // TODO add validation: validate: validationUtils.getIdArrayValidation(),

  handler: (request, h) => {
    let constraints;
    if (request.query.ids) {
      constraints = {
        _id: {$in: request.query.ids}
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

  handler: (request, h) => {
    return apiUtils.update(modelName, User, request.params.id, request.payload);
  }
};

const deleteOne = {
  auth: false,

  validate: validationUtils.getIdParamsValidation(),

  handler: (request, h) => {
    const constraints = {
      _id: request.params.id
    };
    return apiUtils.delete(modelName, User, constraints);
  }
};

const deleteSomeById = {
  auth: false,

  validate: validationUtils.getIdArrayValidation(),

  handler: (request, h) => {
    const constraints = {
      id: {$in: request.payload.ids}
    };
    return apiUtils.delete(modelName, User, constraints);
  }
};

exports.create = create;
exports.getOne = getOne;
exports.getSomeById = getSomeById;
exports.update = update;
exports.deleteOne = deleteOne;
exports.deleteSomeById = deleteSomeById;