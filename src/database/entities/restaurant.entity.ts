import { Column, Entity, OneToMany } from 'typeorm';
import {
  CommonEntity,
  RestaurantMenuEntity,
  RestaurantOperatingHoursEntity,
} from './';

@Entity({ name: 'restaurants' })
export class RestaurantEntity extends CommonEntity {
  @Column()
  name: string;

  @Column({
    name: 'cash_balance',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  cashBalance: number;

  @OneToMany(() => RestaurantMenuEntity, (menus) => menus.restaurant, {
    eager: true,
    cascade: true,
  })
  menus: RestaurantMenuEntity[];

  @OneToMany(
    () => RestaurantOperatingHoursEntity,
    (operatingHours) => operatingHours.restaurant,
    {
      eager: true,
      cascade: true,
    },
  )
  operatingHours: RestaurantOperatingHoursEntity[];
}
