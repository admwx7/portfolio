import { getFirestore } from 'firebase-admin/firestore';
import type { AuthData } from 'firebase-functions/v2/tasks';
import type { CommunityMember, TransactionRecord } from './types';
import { HttpsError } from 'firebase-functions/v2/https';

/**
 * Adds a new member to a community.
 * @param communityName
 * @param userId
 * @param roleRef
 */
export async function addMember(communityName: string, userId: string, roleRef: string): Promise<void> {
  const community = getFirestore().collection('community').doc(communityName);
  // TODO: sanitize the communityName
  const userRef = getFirestore().collection('users').doc(userId);
  const userData = await userRef.get();
  if (!userData.exists) throw new HttpsError('not-found', 'Provided user does not exist');
  const { startingFunds } = (await community.get()).data() || { startingFunds: 0 };
  const role = getFirestore().doc(roleRef);
  if (!(await role.get()).data()) throw new HttpsError('not-found', 'Provided role does not exist');
  const memberRef = community.collection('members').doc(userId);
  if ((await memberRef.get()).exists) {
    throw new HttpsError('already-exists', `This user is already a member of ${communityName}`);
  }

  await Promise.all([
    memberRef.create({
      createdAt: new Date(),
      role,
      funds: startingFunds,
    } as CommunityMember),
    userRef.update({
      communities: [...(userData.data()?.['communities'] || []), community],
    }),
  ]);
}
/**
 * Performs a send transaction on behalf of an authenticated user against a communit:user coupling. Includes support
 * for moderators making direct adjustments to a user's funds (with permission checks). All successful calls result
 * in a transaction history record being created.
 * @param auth - the AuthData object of the user performing the request
 * @param communityName - the name of the community
 * @param to - the userId of the member that will recieve the funds
 * @param amount - the amount to adjust members funds by
 */
export async function performTransaction(
  auth: AuthData,
  communityName: string,
  to: string,
  amount: number
): Promise<void> {
  const isModAction = false;

  const epochTime = Date.now() / 1000;
  if (!auth?.uid || !auth?.token || auth.token.iat >= epochTime || auth.token.exp <= epochTime) {
    throw new HttpsError(
      'unauthenticated',
      `Must be authenticated to send funds. ${auth.token.iat}, ${auth.token.exp}, ${auth.uid}`
    );
  }
  if (auth.uid === to) throw new HttpsError('unavailable', 'A user cannot send funds to themselves');
  const community = getFirestore().collection('community').doc(communityName);
  if (!(await community.get()).exists) {
    throw new HttpsError('not-found', 'An invalid community reference was provided.');
  }
  const fromMember = community.collection('members').doc(auth.uid);
  const fromMemberData = await fromMember.get();
  if (!fromMemberData.exists) {
    throw new HttpsError('permission-denied', 'From User does not exist within the community.');
  }
  if (fromMemberData.data()?.['funds'] < amount || (amount <= 0 && !isModAction)) {
    throw new HttpsError('resource-exhausted', 'Insufficient funds.');
  }
  const toMember = community.collection('members').doc(to);
  const toMemberData = (await toMember.get());
  if (!toMemberData.exists) {
    throw new HttpsError('not-found', 'To User does not exist within the community.');
  }

  await Promise.all([
    fromMember.update({ funds: fromMemberData.data()?.['funds'] - amount }),
    toMember.update({ funds: (toMemberData.data()?.['funds'] || 0) + amount }),
    community.collection('transactions').add({
      amount,
      to: toMember,
      from: fromMember,
      date: new Date(),
    } as TransactionRecord),
  ]);
}
