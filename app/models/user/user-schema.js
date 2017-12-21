'use strict';

const mongoose = require('mongoose');

// Will be needed later for password encryption
// const bcrypt = require('bcrypt');

const tweetSchema = require('../tweet/tweet-schema');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  tweets: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: tweetSchema
  }
}, {
  timestamps: true
});

module.exports = userSchema;