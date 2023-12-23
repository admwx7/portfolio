import { getFirestore, DocumentReference } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

/**
 * Deletes a user's data when the account gets deleted
 */
export const deleteCommunity = onCall(
  { cors: [/amurdock\.dev/, /localhost/] },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Must be authenticated to delete a community.');
    // TODO: sanitize the communityName
    const { name } = request.data;
    if (!name) throw new HttpsError('invalid-argument', 'Name is required to delete a community.');
    const communityRef = getFirestore().collection('community').doc(name);
    if (!(await communityRef.get()).exists) throw new HttpsError('not-found', 'Community does not exist.');
    const memberRef = communityRef.collection('members').doc(uid);
    const memberData = await memberRef.get();
    const ownerRef = getFirestore().collection('roles').doc('owner');
    if (!memberData.exists || !ownerRef.isEqual(memberData.data()?.['role'])) {
      throw new HttpsError('permission-denied', 'Must be the owner of a community to delete it.');
    }
    const members = await communityRef.collection('members').listDocuments();
    // Remove all references on the user objects to the community
    await Promise.all(members.map(async (member) => {
      const userId = member.id;
      const userRef = getFirestore().collection('users').doc(userId);
      const communities = ((await userRef.get()).data()?.['communities'] || [])
        .filter((ref: DocumentReference) => !communityRef.isEqual(ref));
      await userRef.update({ communities });
    }));
    // TODO: fetch sub-collections and recursively delete all documents
    // TODO: remove user references upon account deletion
    // Delete the community object
    await communityRef.delete();
  }
);
