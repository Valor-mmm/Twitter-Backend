'use strict';

const mongoose = require('mongoose');
const tweetSchema = require('./tweet-schema');

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;