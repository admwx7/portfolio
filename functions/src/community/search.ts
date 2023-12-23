import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

/**
 * Searches a community for a member
 */
export const searchCommunityMembers = onCall(
  { cors: [/amurdock\.dev/, /localhost/] },
  async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Must be authenticated to search community members.');
    const { community, search } = request.data;
    if (!community) throw new HttpsError('invalid-argument', 'Community is required to search for members.');
    if (!search) throw new HttpsError('invalid-argument', 'Search is a required field.');
    // TODO: search must be a valid, sanitized email
    const communityRef = getFirestore().collection('community').doc(community);
    if (!(await communityRef.get()).exists) throw new HttpsError('not-found', 'Community provided does not exist.');
    const communityData = (await communityRef.collection('members').doc(uid).get());
    if (!communityData.exists) {
      throw new HttpsError('permission-denied', 'Members can only be searched by communities the user belongs to');
    }

    const { docs } = await getFirestore()
      .collection('users')
      .where('email', '==', search)
      .where('communities', 'array-contains', communityRef)
      .get();
    if (docs.length <= 0) throw new HttpsError('not-found', 'No user matching the search criteria was found.');
    return { userId: docs[0]?.id, email: search };
  }
);
