import { getApp } from 'firebase/app';
import {
  doc,
  getFirestore,
  onSnapshot,
  DocumentReference,
  DocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import type { CommunityMember } from '../../../functions/src/community/types';

import AuthService from '../Auth';
const database = getFirestore(getApp());
const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, '127.0.0.1', 5001);

export { CommunityMember };
/**
 * Possible roles a community member can have.
 */
export enum CommunityRole {
  Owner = 'roles/owner',
  Moderator = 'roles/moderator',
  Member = 'roles/member',
}
/**
 * An object references the user's community relevant details
 */
export interface Community extends CommunityMember {
  name: string;
}

/**
 * Bank Service used for interacting with the community banking APIs.
 */
export class BankService {
  createCommunity = httpsCallable<{ name: string, startingFunds?: number }, unknown>(functions, 'createCommunity');
  deleteCommunity = httpsCallable<{ name: string }, unknown>(functions, 'deleteCommunity');
  joinCommunity = httpsCallable<{ invite?: string }, unknown>(functions, 'joinCommunity');
  report = httpsCallable<{ text: string }, unknown>(functions, 'reportFeedback');
  search = httpsCallable<
    { community: string, search: string },
    { userId: string, email?: string }
  >(functions, 'searchCommunityMembers');
  sendFunds = httpsCallable<
    { amount: number, community: string, to: string },
    unknown
  >(functions, 'sendCommunityFunds');

  /**
   * Fetches the user's community references from the server and aggregates them into a list of membership objects that
   * will update with changes via the handler callback.
   * @param handler
   * @returns
   */
  async list(handler: (records: (DocumentSnapshot<CommunityMember> | null)[]) => void): Promise<() => void> {
    let subscriptions: Unsubscribe[] = [];
    try {
      const userSubscription = onSnapshot(
        doc(database, 'users', AuthService.currentUser!.uid),
        (user) => {
          subscriptions.forEach((unsub) => unsub());
          const { communities } = user.data() as { communities: DocumentReference[] };
          const data: (DocumentSnapshot<CommunityMember> | null)[] = [];
          subscriptions = communities.map((communityRef, index) => {
            data[index] = null;
            return onSnapshot<CommunityMember, CommunityMember>(
              doc(
                communityRef,
                `/members/${AuthService.currentUser?.uid}`
              ) as DocumentReference<CommunityMember, CommunityMember>,
              (community: DocumentSnapshot<CommunityMember>) => { data[index] = community; handler(data); },
              ({ message }: { message: string }) => { alert(message); }
            );
          });
          if (!data.length) handler([]);
        }
      );
      return () => {
        subscriptions.forEach((unsub) => unsub());
        userSubscription();
      };
    } catch (e) {
      const { message } = e as { message: string };
      alert(message);
    }
    return () => { };
  }
}
