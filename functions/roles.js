/* eslint-disable @typescript-eslint/no-var-requires */
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Update a user's roles based on changes the their roles entry in the database
exports.setUserRoles = functions.database.ref('/users/{userId}/roles').onWrite((change, context) => {
  const roles = change.after.val();
  const userId = context.params.userId;

  // Roles can come as 'role-name' or 'role-name:role-value'.  The second option gets combined into an array of values
  const customClaims = {
    roles,
  };

  // Set custom user claims on the associated user
  return admin.auth().setCustomUserClaims(userId, customClaims).
    then(() => {
      // Update real-time database to notify client to force refresh.
      const metadataRef = admin.database().ref(`metadata/${userId}`);
      // Set the refresh time to the current UTC timestamp.
      // This will be captured on the client to force a token refresh.
      return metadataRef.set({
        refreshTime: (new Date()).getTime(),
      });
    });
});
