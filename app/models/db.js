'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
const mongoose = require('mongoose');
const dbConfig = require('./db-config');

let dbURI = dbConfig.dbConnURL;

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.Promise = global.Promise;
mongoose.connect(dbURI, {useMongoClient: true});
const dbConnection = mongoose.connection;


dbConnection.on('connected', () => {
  logger.info(`Connected to mongoDB database at: ${dbURI}`);
  seedDB();
});

dbConnection.on('error', (error) => {
  logger.error(`Can not connect to mongoDB at: ${dbURI}`, error);
});

dbConnection.on('disconnected', () => {
  logger.warn(`Disconnected from database at: ${dbURI}`);
});

const seedDB = async function() {
  if (process.env.NODE_ENV !== 'production') {
    const seeder = require('mongoose-seeder');
    const data = dbConfig.seedData;

    // eslint-disable-next-line no-unused-vars
    const User = require('./user/user');
    // eslint-disable-next-line no-unused-vars
    const Tweet = require('./tweet/tweet');
    // eslint-disable-next-line no-unused-vars
    const Admin = require('./admin/admin');

    try {
      const seededData = await seeder.seed(data, {dropDatabase: false, dropCollections: true});
      const users = await User.find({});
      const tweets = await Tweet.find({});
      for(const aUser of users) {
        for (const aTweet of tweets) {
          if (aUser._doc._id.equals(aTweet._doc.poster)) {
            aUser._doc.tweets.push(aTweet._doc._id);
          }
        }
        aUser.save();
      }
      logger.info('Data seeded to DB', seededData);
    } catch(error) {
      logger.error('Could not seed data.' , error);
    }
  }
};