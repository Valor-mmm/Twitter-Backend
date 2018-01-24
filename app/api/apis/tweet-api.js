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
    image: Joi.string(),
    poster: validationUtils.idSchema(false)
  };

  if (required) {
    return _.merge(baseObject, {
      content: Joi.string().required()
    });
  }

  return _.merge(baseObject, {
    content: Joi.string()
  });
};

const create = {

  validate: {
    payload: getTweetProperties(true),

    failAction: validationUtils.validationErrHandler
  },

  handler: function(request) {
    return apiUtils.create(modelName, request.payload, Tweet);
  }
};

const getOne = {

  validate: validationUtils.getIdParamsValidation(),

  handler: function(request) {
    return apiUtils.findById(modelName, Tweet, request.params.id);
  }
};

const getSomeById = {

  handler: function(request) {
    let query = request.query;
    query = apiUtils.convertIdsQuery(query);
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

  validate: {

    payload: getTweetProperties(false),

    params: {
      id: validationUtils.idSchema()
    },

    failAction: validationUtils.validationErrHandler
  },

  handler: function(request) {
    return apiUtils.update(modelName, Tweet, request.params.id, request.payload);
  }
};

const deleteOne = {

  validate: validationUtils.getIdParamsValidation(),

  handler: function(request) {
    const constraints = {
      _id: request.params.id
    };
    return apiUtils.delete(modelName, Tweet, constraints);
  }
};

const deleteSomeById = {

  validate: validationUtils.getIdArrPayloadValidation(),

  handler: function(request) {
    let constraints;
    let query = apiUtils.convertIdsQuery(request.query);
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