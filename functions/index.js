const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

exports = Object.assign(
  exports,
  require('./register.js'),
  require('./roles.js')
);
