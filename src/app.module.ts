import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';

import { TypeOrmConfigService } from './database/typeorm-config.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { UserPurchaseHistoryModule } from './user-purchase-history/user-purchase-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RestaurantModule,
    UserModule,
    OrderModule,
    UserPurchaseHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
