import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';

import { TypeOrmConfigService } from './database/typeorm-config.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RestaurantMenuModule } from './restaurant-menu/restaurant-menu.module';

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
    RestaurantMenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
