import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/**
 * Deletes a user's data when the account gets deleted
 */
export const accountDeletion = functions.auth.user().onDelete(async ({ uid }) => {
  await Promise.all([
    admin.database().ref(`metadata/${uid}`).remove(),
    admin.database().ref(`users/${uid}`).remove(),
  ]);
});
