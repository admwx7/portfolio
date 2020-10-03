import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// On sign up.
export const processSignUp = functions.auth.user().onCreate((userRecord) => {
  const usersRef = admin.database().ref(`users/${userRecord.uid}`);
  return usersRef.set({
    roles: {
      user: true,
    },
  });
});
