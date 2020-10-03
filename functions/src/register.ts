import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

/**
 * Triggered during the registration process to store / set defaults for the user
 */
export const processSignUp = functions.auth.user().onCreate(({ displayName, email, uid }) => {
  const usersRef = admin.database().ref(`users/${uid}`);
  return usersRef.set({
    // Store displayName and email for account management
    displayName,
    email, // displayName is optional, storing email as a fallback
    // Assign the default role for a new user
    roles: {
      user: true,
    },
  });
});
