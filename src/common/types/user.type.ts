import { UserPurchaseHistoryType } from './user-purchase-history.type';

export type UserType = {
  id: number;
  name: string;
  cashBalance: number;
  purchaseHistory: UserPurchaseHistoryType[];
};
