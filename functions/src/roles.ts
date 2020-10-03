import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/**
 * Update a user's roles based on changes the their roles entry in the database
 */
export const setUserRoles = functions.database.ref('/users/{userId}/roles')
  .onWrite(async (change, context) => {
    const roles = change.after.val();
    const userId = context.params.userId;

    // Roles can come as 'role-name' or 'role-name:role-value'.  The second option gets combined into an array of values
    const customClaims = {
      roles,
    };

    // Set custom user claims on the associated user
    await admin.auth().setCustomUserClaims(userId, customClaims);
    // Update real-time database to notify client to force refresh.
    const metadataRef = admin.database().ref(`metadata/${userId}`);
    // Set the refresh time to the current UTC timestamp.
    // This will be captured on the client to force a token refresh.
    return metadataRef.set({
      refreshTime: (new Date()).getTime(),
    });
  });
