'use strict';

const Joi = require('joi');
const logger = require('simple-node-logger').createSimpleLogger();

const Admin = require('../../models/admin/admin');
const apiUtils = require('../api-utils');
const validationUtils = require('../validation-utils');
const authUtils = require('../auth-utils');

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


const authenticate = {

  auth: false,

  validate: {

    payload: {
      username: Joi.string().required(),
      password: Joi.string().required()
    },

    failAction: validationUtils.validationErrHandler
  },

  handler: (request, h) => {
    const password = request.payload.password;
    const username = request.payload.username;
    const conditions = {
      username: username
    };

    return authenticateAdmin(conditions, password, h);
  }
};

const create = {

  validate: {
    payload: getTweetProperties(true),

    failAction: validationUtils.validationErrHandler
  },

  handler: function (request) {
    return apiUtils.create(modelName, request.payload, Admin);
  }
};

const getOne = {

  validate: validationUtils.getIdParamsValidation(),

  handler: function (request) {
    return apiUtils.findById(modelName, Admin, request.params.id);
  }
};

const getSomeById = {


  handler: function (request) {
    let query = request.query;
    query = apiUtils.convertIdsQuery(query);
    let constraints;
    logger.info('Query: ', query);
    if (query.ids) {
      constraints = {
        _id: {$in: query.ids}
      };
    }

    return apiUtils.find(modelName, Admin, constraints ? constraints : null);
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

  handler: function (request) {
    return apiUtils.update(modelName, Admin, request.params.id, request.payload);
  }
};

const deleteOne = {

  validate: validationUtils.getIdParamsValidation(),

  handler: function (request) {
    const constraints = {
      _id: request.params.id
    };
    return apiUtils.delete(modelName, Admin, constraints, true);
  }
};

const deleteSomeById = {

  validate: validationUtils.getIdArrPayloadValidation(),

  handler: function (request) {
    let constraints;
    let query = apiUtils.convertIdsQuery(request.query);
    if (query.ids) {
      constraints = {
        _id: {$in: query.ids}
      };
    }

    return apiUtils.delete(modelName, Admin, constraints, true);
  }
};


const authenticateAdmin = async function (conditions, password, h) {
  const authResult = await authUtils.authenticate(modelName, Admin, conditions, password);
  if (!authResult.success) {
    return h.response(
      {success: false, message: 'Authentication failed. Admin not found.'}).code(201);
  }

  const payload = {
    id: authResult.id,
    modelName: modelName,
    username: conditions.username
  };
  const token = authUtils.createToken(payload);
  return h.response({success: true, token: token, id: authResult.id}).code(201);
};


const validateAdminToken = async function (decoded) {
  const constraints = {
    _id: decoded.id,
    username: decoded.username
  };
  let queryResult = await apiUtils.findOne(modelName, Admin, constraints);
  if (queryResult && queryResult._doc) {
    queryResult = queryResult._doc;
  }
  return (queryResult && queryResult._id && queryResult._id.toString() === decoded.id);
};
authUtils.registerForValidation(modelName, validateAdminToken);

exports.authenticate = authenticate;
exports.create = create;
exports.getOne = getOne;
exports.getSomeById = getSomeById;
exports.update = update;
exports.deleteOne = deleteOne;
exports.deleteSomeById = deleteSomeById;