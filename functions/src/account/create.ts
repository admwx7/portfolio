import { getFirestore } from 'firebase-admin/firestore';
import { auth } from 'firebase-functions';

/**
 * Triggered during the registration process to store / set defaults for the user
 */
export const createAccount = auth.user().onCreate(({ displayName, email, uid }) => {
  return getFirestore().collection('users').doc(uid).create({
    // Store displayName and email for account management
    displayName,
    email, // displayName is optional, storing email as a fallback
    // Assign the default role for a new user
    roles: {
      user: true,
    },
  });
});
