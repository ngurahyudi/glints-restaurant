import { DaysEnum } from '../../common/enums/days.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity, RestaurantEntity } from './';

@Entity({ name: 'restaurant_operating_hours' })
export class RestaurantOperatingHoursEntity extends CommonEntity {
  @Column({
    type: 'enum',
    enum: DaysEnum,
    default: DaysEnum.MONDAY,
  })
  day: DaysEnum;

  @Column({ name: 'open_time', type: 'time' })
  openTime: string;

  @Column({ name: 'close_time', type: 'time' })
  closeTime: string;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.menus)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantEntity;
}
