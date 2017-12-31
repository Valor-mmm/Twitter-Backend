'use strict';

const Joi = require('joi');
const _ = require('lodash');
const logger = require('simple-node-logger').createSimpleLogger();

const Tweet = require('../../models/tweet/tweet');
const apiUtils = require('../api-utils');
const validationUtils = require('../validation-utils');

const modelName = 'Tweet';

const getTweetProperties = function (required) {
  const baseObject = {
    upvotes: Joi.number().min(0),
    image: Joi.string()
  };

  if (required) {
    return _.merge(baseObject, {
      content: Joi.string().required(),
      poster: validationUtils.idSchema(false),
    });
  }

  return _.merge(baseObject, {
    content: Joi.string()
  });
};

const create = {
  auth: false,

  validate: {
    payload: getTweetProperties(true),

    failAction: validationUtils.validationErrHandler
  },

  handler: (request) => {
    return apiUtils.create(modelName, request.payload, Tweet);
  }
};

const getOne = {
  auth: false,

  // TODO add validation:validate: validationUtils.getIdParamsValidation(),

  handler: (request) => {
    return apiUtils.findById(modelName, Tweet, request.params.id);
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

    return apiUtils.find(modelName, Tweet, constraints ? constraints : null);
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
    return apiUtils.update(modelName, Tweet, request.params.id, request.payload);
  }
};

const deleteOne = {
  auth: false,

  validate: validationUtils.getIdParamsValidation(),

  handler: (request) => {
    const constraints = {
      _id: request.params.id
    };
    return apiUtils.delete(modelName, Tweet, constraints);
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

    return apiUtils.delete(modelName, Tweet, constraints);
  }
};

exports.create = create;
exports.getOne = getOne;
exports.getSomeById = getSomeById;
exports.update = update;
exports.deleteOne = deleteOne;
exports.deleteSomeById = deleteSomeById;