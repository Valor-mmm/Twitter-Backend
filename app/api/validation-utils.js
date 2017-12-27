'use strict';

const Joi = require('joi');
const Boom = require('boom');

const getIdSchema = () => {
  return Joi.string();// TODO find fitting regex .regex(/^[a-fA-F/d]{24}$/);
};


const getIdArraySchema = () => {
  return Joi.array().items(getIdSchema());
};


const validationErrHandler = (request, h, error) => {
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
    payload: {
      ids: getIdArraySchema()
    },

    failAction: validationErrHandler
  };
};

exports.idSchema = getIdSchema;
exports.idArraySchema = getIdArraySchema;
exports.validationErrHandler = validationErrHandler;
exports.getIdParamsValidation = getIdParamsValidation;
exports.getIdArrayValidation = getIdArrayValidation;