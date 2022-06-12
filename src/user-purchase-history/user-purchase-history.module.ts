import { Module } from '@nestjs/common';
import { UserPurchaseHistoryService } from './user-purchase-history.service';

@Module({
  providers: [UserPurchaseHistoryService],
  exports: [UserPurchaseHistoryService],
})
export class UserPurchaseHistoryModule {}
