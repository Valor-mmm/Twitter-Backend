'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
const Boom = require('boom');
const cloudinary = require('cloudinary');
const uploader = cloudinary.v2.uploader;

let cloudinaryConfig = require('./cloudinary-config');

if (process.env.NODE_ENV === 'production') {
  cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  };
}
cloudinary.config(cloudinaryConfig);

const uploadImage = async function(data) {
  try {
    const result = await upload(data);
    return result;
  } catch (error) {
    logger.error('Error during image upload.', error);
    return Boom.badImplementation('Could not upload image.');
  }
};

const upload = function (data) {
  const result = uploader.upload(data.path);
  return result;
};

const getImageUrl = async function (publicId) {
  const result = cloudinary.url(publicId, {secure: true});
  return result;
};


exports.uploadImage = uploadImage;
exports.getImageUrl = getImageUrl;