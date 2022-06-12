import { UserPurchaseHistoryLoadType } from './user-purchase-history-load.type';

export type UserLoadType = {
  id: number;
  name: string;
  cashBalance: number;
  purchaseHistory: UserPurchaseHistoryLoadType[];
};
