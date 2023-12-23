import { getFirestore } from 'firebase-admin/firestore';
import { auth } from 'firebase-functions';

/**
 * Deletes a user's data when the account gets deleted
 */
export const deleteAccount = auth.user().onDelete(({ uid }) => {
  const db = getFirestore();
  return Promise.all([
    db.collection('users').doc(uid).delete(),
  ]);
});
