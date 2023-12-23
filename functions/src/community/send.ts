import { onCall } from 'firebase-functions/v2/https';
import { performTransaction } from './utils';

/**
 * Searches a community for a member
 */
export const sendCommunityFunds = onCall(
  { cors: [/amurdock\.dev/, /localhost/] },
  async (request) => {
    const { amount, community, to } = request.data;
    await performTransaction(request.auth!, community, to, amount);
  }
);
