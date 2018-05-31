const admin = require('firebase-admin');
const functions = require('firebase-functions');

// On sign up.
exports.processSignUp = functions.auth.user().onCreate((userRecord) => {
  const usersRef = admin.database().ref(`users/${userRecord.uid}`);
  return usersRef.set({
    roles: {
      user: true,
    },
  });
});
