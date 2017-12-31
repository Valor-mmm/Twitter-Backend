'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
const Boom = require('boom');
const _ = require('lodash');

const arrayPattern = new RegExp('^(\\w*?)\\[(\\d*?)\\]$');


const create = function (modelName, modelData, model) {
  const toSave = new model(modelData);
  const savedEntity = save(toSave, modelName);
  if (savedEntity) {
    return savedEntity;
  }
  const message = `Could not save model [${modelName}]`;
  logger.error(message);
  return Boom.badImplementation(message);
};


const find = function (modelName, model, constraints, fields) {
  const query = createQuery(modelName, model, constraints, fields);
  return executeQuery(modelName, query);
};


const findById = function (modelName, model, id, fields) {
  const query = createQueryById(modelName, model, id, fields);
  return executeQuery(modelName, query);
};

const findOne = function (modelName, model, constraints, fields) {
  logger.info(`Creating query findOne for [${modelName}]`);
  const query = model.findOne(constraints, fields);
  return executeQuery(modelName, query);
};


const update = function (modelName, model, id, newData) {
  logger.debug(`Creating query findOneAndUpdate for [${modelName}] and id [${id}].`);
  const query = model.findOneAndUpdate({_id: id}, newData, {new: true});
  logger.debug('Finished creating query', query);

  return executeQuery(modelName, query);
};


const deleteEntry = async function (modelName, model, constraints) {
  try {
    await model.remove(constraints ? constraints : {});
    logger.info(`Deleted document(s) of model [${modelName}]`);
    return true;
  } catch (error) {
    const message = `Could not remove document(s) of model [${modelName}]`;
    logger.error(message, error);
    return Boom.badImplementation(message);
  }
};


const executeQuery = async function(modelName, query) {
  try {
    const result = await query.exec();
    logger.info(`Successfully executed query for [${modelName}].`);
    return result;
  } catch (error) {
    logger.error(`Error during query for model [${modelName}]`, error);
    return Boom.badImplementation(`Could not query DB for [${modelName}]`);
  }
};


const createQuery = function(modelName, model, constraints, fields) {
  logger.debug(`Creating query for ${modelName}, for fields ${fields}`);


  const query = model.find(constraints ? constraints : {});
  if (fields) {
    query.select(fields);
  }

  logger.debug('Finished creating query', query);
  return query;
};


const createQueryById = function (modelName, model, id, fields) {
  logger.debug(`Creating query for [${modelName}] and id [${id}].`);

  const query = model.findById(id);
  if (fields) {
    query.select(fields);
  }

  logger.debug('Finished creating query', query);
  return query;
};


const save = async function (toSave, modelName){
  logger.debug(`Saving model [${modelName}]`);
  try {
    const savedEntity = await toSave.save();
    logger.info(`Successfully saves model [${modelName}].`);
    return savedEntity;
  } catch(error) {
    logger.error(`Could not save model [${modelName}].`, error);
    return false;
  }
};


const convertQueryString = function (query) {
  let queryObject = {};
  const queryElements = _.toPairs(query);

  for (const queryElem of queryElements) {
    if (arrayPattern.test(queryElem[0])) {
      queryObject = addToArray(queryObject, queryElem);
    } else {
      queryObject[queryElem[0]] = queryElem[1];
    }
  }
  return queryObject;
};


const addToArray = function (queryObject, queryElem) {
  const match = arrayPattern.exec(queryElem[0]);
  const arrName = match[1];
  const arrIndex = match[2];

  if (queryObject.hasOwnProperty(arrName)) {
    queryObject[arrName].splice(arrIndex, 0, queryElem[1]);
  } else {
    queryObject[arrName] = [queryElem[1]];
  }

  return queryObject;
};


exports.create = create;
exports.find = find;
exports.findById = findById;
exports.findOne = findOne;
exports.update = update;
exports.delete = deleteEntry;
exports.convertQueryString = convertQueryString;