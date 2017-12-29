'use strict';

const _ = require('lodash');

const userApi = require('./app/api/user-api');
const tweetApi = require('./app/api/tweet-api');
const adminApi = require('./app/api/admin-api');

const apiPath = '/api/';
const userPath = 'users';
const tweetPath = 'tweets';
const adminPath = 'admins';

const corsOption = {
  cors: true
};

const securityOption = {

};

const getOptions = (specificOptions) => {
  const result = _.merge(_.clone(corsOption), securityOption, specificOptions);
  return result;
};

const getPath = (path, id) => {
  const basePath = apiPath + path;
  if (id) {
    return `${basePath}/{id}`;
  }
  return basePath;
};

const apiRoutes = [

  {method: 'POST', path: getPath(userPath), options: getOptions(userApi.create)},
  {method: 'GET', path: getPath(userPath, true), options: getOptions(userApi.getOne)},
  {method: 'GET', path: getPath(userPath), options: getOptions(userApi.getSomeById)},
  {method: 'PUT', path: getPath(userPath, true), options: getOptions(userApi.update)},
  {method: 'DELETE', path: getPath(userPath, true), options: getOptions(userApi.deleteOne)},
  {method: 'DELETE', path: getPath(userPath), options: getOptions(userApi.deleteSomeById)},

  {method: 'POST', path: getPath(tweetPath), options: getOptions(tweetApi.create)},
  {method: 'GET', path: getPath(tweetPath, true), options: getOptions(tweetApi.getOne)},
  {method: 'GET', path: getPath(tweetPath), options: getOptions(tweetApi.getSomeById)},
  {method: 'PUT', path: getPath(tweetPath, true), options: getOptions(tweetApi.update)},
  {method: 'DELETE', path: getPath(tweetPath, true), options: getOptions(tweetApi.deleteOne)},
  {method: 'DELETE', path: getPath(tweetPath), options: getOptions(tweetApi.deleteSomeById)},

  {method: 'POST', path: getPath(adminPath), options: getOptions(adminApi.create)},
  {method: 'GET', path: getPath(adminPath, true), options: getOptions(adminApi.getOne)},
  {method: 'GET', path: getPath(adminPath), options: getOptions(adminApi.getSomeById)},
  {method: 'PUT', path: getPath(adminPath, true), options: getOptions(adminApi.update)},
  {method: 'DELETE', path: getPath(adminPath, true), options: getOptions(adminApi.deleteOne)},
  {method: 'DELETE', path: getPath(adminPath), options: getOptions(adminApi.deleteSomeById)},

];

module.exports = apiRoutes;