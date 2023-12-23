import { DocumentReference } from 'firebase-admin/firestore';

export interface CommunityMember {
  createdAt: Date;
  funds: number;
  role: DocumentReference;
}
export interface TransactionRecord {
  amount: number;
  date: Date;
  to: DocumentReference;
  from: DocumentReference;
}
