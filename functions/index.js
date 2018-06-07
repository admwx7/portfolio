require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports = Object.assign(
  exports,
  require('./register.js'),
  require('./roles.js')
);
