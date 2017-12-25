'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
const Boom = require('boom');
const _ = require('lodash');


const create = function (modelName, modelData, model) {
  const toSave = new model(modelData);
  const couldSave = save(toSave, modelName);
  if (couldSave) {
    return true;
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


const update = function (modelName, model, id, newData) {
  const toChange = findById(modelName, model, id);

  // TODO !!

  const changed = _.merge(toChange, newData);
  const couldSave = save(changed, modelName);
  if (couldSave) {
    return true;
  }
  const message = `Could not update model [${modelName}]`;
  logger.error(message);
  return Boom.badImplementation(message);
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
    await toSave.save();
    logger.info(`Successfully saves model [${modelName}].`);
    return true;
  } catch(error) {
    logger.error(`Could not save model [${modelName}].`, error);
    return false;
  }
};


exports.create = create;
exports.find = find;
exports.findById = findById;
exports.update = update;
exports.delete = deleteEntry;