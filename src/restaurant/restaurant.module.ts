import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantEntity, RestaurantMenuEntity } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, RestaurantMenuEntity])],
  providers: [RestaurantService],
  controllers: [RestaurantController],
  exports: [RestaurantService],
})
export class RestaurantModule {}
