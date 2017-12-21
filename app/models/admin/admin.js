'use strict';

const mongoose = require('mongoose');
const adminSchema = require('./admin-schema');

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
