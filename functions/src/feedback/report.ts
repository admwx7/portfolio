import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

/**
 * Deletes a user's data when the account gets deleted
 */
export const reportFeedback = onCall(
  { cors: [/amurdock\.dev/, /localhost/] },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Must be authenticated to provide feedback.');
    const { text } = request.data;
    if (!text) throw new HttpsError('invalid-argument', 'Text is required to provide feedback.');
    // TODO: sanitize the text

    await getFirestore().collection('feedback').add({
      createdAt: new Date(),
      text,
      user: getFirestore().collection('users').doc(uid),
    });
  }
);
