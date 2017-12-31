'use strict';

const Joi = require('joi');
const logger = require('simple-node-logger').createSimpleLogger();

const Admin = require('../../models/admin/admin');
const apiUtils = require('../api-utils');
const validationUtils = require('../validation-utils');

const modelName = 'Admin';

const getTweetProperties = function (required) {

  if (required) {
    return {
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required()
    };
  }

  return {
    username: Joi.string(),
    email: Joi.string(),
    password: Joi.string()
  };
};

const create = {
  auth: false,

  validate: {
    payload: getTweetProperties(true),

    failAction: validationUtils.validationErrHandler
  },

  handler: (request) => {
    return apiUtils.create(modelName, request.payload, Admin);
  }
};

const getOne = {
  auth: false,

  // TODO add validation:validate: validationUtils.getIdParamsValidation(),

  handler: (request) => {
    return apiUtils.findById(modelName, Admin, request.params.id);
  }
};

const getSomeById = {
  auth: false,

  // TODO add validation: validate: validationUtils.getIdArrayValidation(),

  handler: (request) => {
    let query = request.query;
    query = apiUtils.convertQueryString(query);
    let constraints;
    logger.info('Query: ' ,query);
    if (query.ids) {
      constraints = {
        _id: {$in: query.ids}
      };
    }

    return apiUtils.find(modelName, Admin, constraints ? constraints : null);
  }
};

const update = {
  auth: false,

  validate: {

    payload: getTweetProperties(false),

    params: {
      id: validationUtils.idSchema()
    },

    failAction: validationUtils.validationErrHandler
  },

  handler: (request) => {
    return apiUtils.update(modelName, Admin, request.params.id, request.payload);
  }
};

const deleteOne = {
  auth: false,

  validate: validationUtils.getIdParamsValidation(),

  handler: (request) => {
    const constraints = {
      _id: request.params.id
    };
    return apiUtils.delete(modelName, Admin, constraints);
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

    return apiUtils.delete(modelName, Admin, constraints);
  }
};

exports.create = create;
exports.getOne = getOne;
exports.getSomeById = getSomeById;
exports.update = update;
exports.deleteOne = deleteOne;
exports.deleteSomeById = deleteSomeById;