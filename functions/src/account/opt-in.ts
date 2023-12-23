import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

/**
 * Deletes a user's data when the account gets deleted
 */
export const optIn = onCall(
  { cors: [/amurdock\.dev/, /localhost/] },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Must be authenticated to opt-in to a new feature.');
    const userRef = getFirestore().collection('users').doc(uid);
    const { feature } = request.data;
    switch (feature) {
      case 'banking':
        await userRef.set({ roles: { [feature]: true } }, { merge: true });
        break;
      default:
        throw new HttpsError('invalid-argument', 'Must provide a valid feature to opt into.');
    }
  }
);
