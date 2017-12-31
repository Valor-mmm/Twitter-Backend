'use strict';

const Joi = require('joi');

const validationUtils = require('../validation-utils');
const imageHandler = require('../../models/image-handler');

const saveImage = {

  auth: false,

  payload: {
    maxBytes: 30485760,
    output: 'file',
    allow: 'multipart/form-data'
  },

  validate: {
    payload: {

      image: Joi.any().meta({swaggerType: 'file'}).description('image file').required(),

    },

    failAction: validationUtils.validationErrHandler
  },

  handler: (request) => {
    const data = request.payload.image;
    return imageHandler.uploadImage(data);
  }
};

const getImageUrl = {

  auth: false,

  validate: {
    query: {
      publicId: Joi.string().required(),
    },

    failAction: validationUtils.validationErrHandler
  },

  handler: (request) => {
    const publicId = request.query.publicId;
    return imageHandler.getImageUrl(publicId);
  }
};

exports.saveImage = saveImage;
exports.getImageUrl = getImageUrl;