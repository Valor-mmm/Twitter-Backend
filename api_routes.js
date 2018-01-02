'use strict';

const _ = require('lodash');
const Boom = require('boom');
const logger = require('simple-node-logger').createSimpleLogger();

const userApi = require('./app/api/apis/user-api');
const tweetApi = require('./app/api/apis/tweet-api');
const adminApi = require('./app/api/apis/admin-api');
const imageApi = require('./app/api/apis/image-api');

const apiPath = '/api/';
const userPath = 'users';
const tweetPath = 'tweets';
const adminPath = 'admins';
const imagePath = 'images';

const corsOption = {
  cors: true
};

const getOptions = (specificOptions, roles) => {
  const result = _.merge(_.clone(corsOption), specificOptions);

  if (roles) {
    result.handler = authorizeBeforeHandler(roles, result.handler);
  }
  return result;
};

const getPath = (path, id) => {
  const basePath = apiPath + path;
  if (id) {
    return `${basePath}/{id}`;
  }
  return basePath;
};

const authorizeBeforeHandler = (roles, handler) => {

  return (request, h) => {
    const modelName = request.auth.credentials.modelName;
    const isAuthorized = roles.indexOf(modelName) > -1;
    if (!isAuthorized) {
      logger.warn(`Could not authorize request for modelName [${modelName}]`, roles);
      return Boom.unauthorized(`Not authorized with role: [${modelName}]`);
    }
    logger.debug(`Authorised request for [${modelName}]`);
    return handler(request, h);
  };
};

const apiRoutes = [

  {method: 'POST', path: getPath(userPath) + '/authenticate', options: getOptions(userApi.authenticate)},
  {method: 'POST', path: getPath(userPath), options: getOptions(userApi.create)},
  {method: 'GET', path: getPath(userPath, true), options: getOptions(userApi.getOne, ['User', 'Admin'])},
  {method: 'GET', path: getPath(userPath), options: getOptions(userApi.getSomeById, ['User', 'Admin'])},
  {method: 'PUT', path: getPath(userPath, true), options: getOptions(userApi.update, ['User'])},
  {method: 'DELETE', path: getPath(userPath, true), options: getOptions(userApi.deleteOne, ['User', 'Admin'])},
  {method: 'DELETE', path: getPath(userPath), options: getOptions(userApi.deleteSomeById, ['Admin'])},

  {method: 'POST', path: getPath(tweetPath), options: getOptions(tweetApi.create, ['User'])},
  {method: 'GET', path: getPath(tweetPath, true), options: getOptions(tweetApi.getOne, ['User', 'Admin'])},
  {method: 'GET', path: getPath(tweetPath), options: getOptions(tweetApi.getSomeById, ['User', 'Admin'])},
  {method: 'PUT', path: getPath(tweetPath, true), options: getOptions(tweetApi.update, ['User'])},
  {method: 'DELETE', path: getPath(tweetPath, true), options: getOptions(tweetApi.deleteOne, ['User', 'Admin'])},
  {method: 'DELETE', path: getPath(tweetPath), options: getOptions(tweetApi.deleteSomeById, ['User', 'Admin'])},

  {method: 'POST', path: getPath(adminPath) + '/authenticate', options: getOptions(adminApi.authenticate)},
  {method: 'POST', path: getPath(adminPath), options: getOptions(adminApi.create, ['Admin'])},
  {method: 'GET', path: getPath(adminPath, true), options: getOptions(adminApi.getOne, ['Admin'])},
  {method: 'GET', path: getPath(adminPath), options: getOptions(adminApi.getSomeById, ['Admin'])},
  {method: 'PUT', path: getPath(adminPath, true), options: getOptions(adminApi.update, ['Admin'])},
  {method: 'DELETE', path: getPath(adminPath, true), options: getOptions(adminApi.deleteOne, ['Admin'])},
  {method: 'DELETE', path: getPath(adminPath), options: getOptions(adminApi.deleteSomeById, ['Admin'])},

  {method: 'POST', path: getPath(imagePath), options: getOptions(imageApi.saveImage, ['User'])},
  {method: 'GET', path: getPath(imagePath), options: getOptions(imageApi.getImageUrl, ['User', 'Admin'])},

];

module.exports = apiRoutes;