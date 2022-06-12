import { Module } from '@nestjs/common';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { UserPurchaseHistoryModule } from '../user-purchase-history/user-purchase-history.module';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [RestaurantModule, UserModule, UserPurchaseHistoryModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
