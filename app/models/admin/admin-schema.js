'use strict';

const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = adminSchema;