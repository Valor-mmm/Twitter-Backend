'use strict';

const _ = require('lodash');

const userApi = require('./app/api/user-api');

const apiPath = '/api/';
const userPath = 'users';

const corsOption = {
  cors: true
};

const securityOption = {

};

const getOptions = (specificOptions) => {
  const secureCorsOption = _.merge(corsOption, securityOption);
  return _.merge(secureCorsOption, specificOptions);
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

];

module.exports = apiRoutes;