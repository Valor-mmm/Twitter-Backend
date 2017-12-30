'use strict';

const cloudinary = require('cloudinary');
const uploader = cloudinary.v2.uploader;

let cloudinaryConfig = require('./cloudinary-config');

if (process.env.NODE_ENV === 'production') {
  cloudinaryConfig = process.env.CLOUDINARY_CONFIG;
}
cloudinary.config(cloudinaryConfig);

const uploadImage = async function(data) {
  const result = await upload(data);
  return result;
};

const upload = async function (data) {
  const result = uploader.upload(data.path);
  return result;
};

const getImageUrl = async function (publicId) {
  const result = cloudinary.url(publicId);
  return result;
};


exports.uploadImage = uploadImage;
exports.getImageUrl = getImageUrl;