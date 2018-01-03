'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
const Boom = require('boom');
const _ = require('lodash');
const TimeLogger = require('time-logger');
TimeLogger.log = (key, details) => logger.debug(key, details);

const arrayPattern = new RegExp('^(\\w*?)\\[(\\d*?)\\]$');

const createTimeName = 'create';
const create = function (modelName, modelData, model) {
  TimeLogger.start(createTimeName);
  const toSave = new model(modelData);
  const savedEntity = save(toSave, modelName);
  if (savedEntity) {
    wrapUpTimeLog(createTimeName);
    return savedEntity;
  }
  const message = `Could not save model [${modelName}]`;
  logger.error(message);
  wrapUpTimeLog(createTimeName);
  return Boom.badImplementation(message);
};


const findTimeName = 'find';
const find = function (modelName, model, constraints, fields) {
  TimeLogger.start(findTimeName);
  const query = createQuery(modelName, model, constraints, fields);
  const queryResult = executeQuery(modelName, query);
  wrapUpTimeLog(findTimeName);
  return queryResult;
};


const findByIdTimeName = 'findById';
const findById = function (modelName, model, id, fields) {
  TimeLogger.start(findByIdTimeName);
  const query = createQueryById(modelName, model, id, fields);
  const queryResult = executeQuery(modelName, query);
  wrapUpTimeLog(findByIdTimeName);
  return queryResult;
};


const findOneTimeName = 'findOne';
const findOne = function (modelName, model, constraints, fields) {
  TimeLogger.start(findOneTimeName);
  logger.info(`Creating query findOne for [${modelName}]`);
  const query = model.findOne(constraints, fields);
  const queryResult = executeQuery(modelName, query);
  wrapUpTimeLog(findOneTimeName);
  return queryResult;
};


const updateTimeName = 'update';
const update = function (modelName, model, id, newData) {
  TimeLogger.start(updateTimeName);
  logger.debug(`Creating query findOneAndUpdate for [${modelName}] and id [${id}].`);
  const query = model.findOneAndUpdate({_id: id}, newData, {new: true});
  logger.debug('Finished creating query', query);
  const queryResult = executeQuery(modelName, query);
  wrapUpTimeLog(updateTimeName);
  return queryResult;
};


const deleteTimeName = 'delete';
const deleteEntry = async function (modelName, model, constraints, preventEmptyCollection) {
  TimeLogger.start(deleteTimeName);
  try {

    if (preventEmptyCollection) {
      constraints = await checkDeleteWouldEmpty(modelName, model, constraints);
    }

    await model.remove(constraints ? constraints : {});
    logger.info(`Deleted document(s) of model [${modelName}]`);
    wrapUpTimeLog(deleteTimeName);
    return true;
  } catch (error) {
    const message = `Could not remove document(s) of model [${modelName}]`;
    logger.error(message, error);
    wrapUpTimeLog(deleteTimeName);
    return Boom.badImplementation(message);
  }
};


const checkDeleteWouldEmpty = async function (modelName, model, constraints) {
  const queryAll = model.find({});
  const findAllPromise = executeQuery(modelName, queryAll);

  if (!constraints) {
    return {_id: {$in: await omitFirstId(modelName, findAllPromise)}};
  }

  const constrainedQuery = model.find(constraints);
  const constrainedPromise = executeQuery(modelName, constrainedQuery);

  const findAllResult = await findAllPromise;
  if (findAllResult.length <= 1) {
    // dont delete anything when only one entry is in the collection
    return {_id: {$in: []}};
  }

  const constrainedResult = await constrainedPromise;
  if (constrainedResult.length >= findAllResult.length) {
    return {_id: {$in: await omitFirstId(modelName, findAllPromise)}};
  }

  return constraints;
};


const omitFirstId = async function(modelName, queryPromise) {
  const resultArray = [];
  const promiseResult = await queryPromise;
  for (let i = 1; i < promiseResult.length; i++){
    resultArray.push(promiseResult[i]._doc._id);
  }
  return resultArray;
};


const executeQuery = async function (modelName, query) {
  try {
    const result = await query.exec();
    logger.info(`Successfully executed query for [${modelName}].`);
    return result;
  } catch (error) {
    logger.error(`Error during query for model [${modelName}]`, error);
    return Boom.badImplementation(`Could not query DB for [${modelName}]`);
  }
};


const createQuery = function (modelName, model, constraints, fields) {
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


const save = async function (toSave, modelName) {
  logger.debug(`Saving model [${modelName}]`);
  try {
    const savedEntity = await toSave.save();
    logger.info(`Successfully saves model [${modelName}].`);
    return savedEntity;
  } catch (error) {
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


const wrapUpTimeLog = function (label) {
  TimeLogger.end(label);
  TimeLogger.dump(label);
  TimeLogger.clear(label);
};


exports.create = create;
exports.find = find;
exports.findById = findById;
exports.findOne = findOne;
exports.update = update;
exports.delete = deleteEntry;
exports.convertQueryString = convertQueryString;