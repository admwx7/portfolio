import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { addMember } from './utils';

/**
 * Deletes a user's data when the account gets deleted
 */
export const createCommunity = onCall(
  { cors: [/amurdock\.dev/, /localhost/] },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Must be authenticated to create a community.');
    const { name, startingFunds = 0 } = request.data;
    if (!name) throw new HttpsError('invalid-argument', 'Name is required to create a community.');
    // TODO: sanitize the communityName
    if (typeof startingFunds !== 'number') {
      throw new HttpsError('invalid-argument', 'Invalid type of startingFunds, must be a number');
    }
    if ((await getFirestore().collection('community').doc(name).get()).exists) {
      throw new HttpsError('already-exists', 'A community with this name already exists');
    }
    await getFirestore().collection('community').doc(name).create({
      startingFunds,
    });
    await addMember(name, uid, '/roles/owner');
  }
);
