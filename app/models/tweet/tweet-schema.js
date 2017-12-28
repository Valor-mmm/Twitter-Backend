'use strict';

const mongoose = require('mongoose');
const userSchema = require('../user/user-schema');

const tweetSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  image: {
    type: Buffer,
    contentType: String
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userSchema
  },
  upvotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = tweetSchema;