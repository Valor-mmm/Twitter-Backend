'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
const mongoose = require('mongoose');
const dbConfig = require('./db-config');

let dbURI = dbConfig.dbConnURL;

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI, {useMongoClient: true});
const dbConnection = mongoose.connection;


dbConnection.on('connected', () => {
  logger.info(`Connected to mongoDB database at: ${dbURI}`);
});

dbConnection.on('error', (error) => {
  logger.error(`Can not connect to mongoDB at: ${dbURI}`, error);
});

dbConnection.on('disconnected', () => {
  logger.warn(`Disconnected from database at: ${dbURI}`);
});