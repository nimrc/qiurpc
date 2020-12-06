'use strict';

const { MongoClient } = require('mongodb');

module.exports = new MongoClient('mongodb://127.0.0.1:27017');
