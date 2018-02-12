const admin = require('firebase-admin');
const functions = require('firebase-functions');

// On sign up.
exports.processSignUp = functions.auth.user().onCreate((event) => {
  // The Firebase user.
  const user = event.data;
  const usersRef = admin.database().ref(`users/${user.uid}`);
  return usersRef.set({
    roles: {
      user: true,
    },
  });
});
