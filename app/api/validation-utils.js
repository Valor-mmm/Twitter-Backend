'use strict';

const Joi = require('joi');
const Boom = require('boom');
const logger = require('simple-node-logger').createSimpleLogger();

const getIdSchema = (isRequired) => {
  if (isRequired) {
    return Joi.string().required();
  }
  return Joi.string();
};


const getIdArraySchema = () => {
  return Joi.array().items(Joi.string());
};


const validationErrHandler = (request, h, error) => {
  logger.error('Could not validate request.', error);
  return Boom.badData(error.message);
};


const getIdParamsValidation = () => {
  return {
    params: {
      id: getIdSchema()
    },

    failAction: validationErrHandler
  };
};


const getIdArrayValidation = () => {
  return {
    payload: Joi.object({
      ids: getIdArraySchema()
    }).allow(null),

    failAction: validationErrHandler
  };
};

exports.idSchema = getIdSchema;
exports.idArraySchema = getIdArraySchema;
exports.validationErrHandler = validationErrHandler;
exports.getIdParamsValidation = getIdParamsValidation;
exports.getIdArrayValidation = getIdArrayValidation;