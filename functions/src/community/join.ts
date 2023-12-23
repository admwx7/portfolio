import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { addMember } from './utils';

/**
 * Deletes a user's data when the account gets deleted
 */
export const joinCommunity = onCall(
  { cors: [/amurdock\.dev/, /localhost/] },
  (request) => {
    if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'User must be authenticated.');
    const { invite } = request.data;
    const uid = request.auth?.uid;
    return addMember(invite, uid, '/roles/member');
  }
);
