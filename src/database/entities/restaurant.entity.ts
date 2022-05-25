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

  @Column()
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
