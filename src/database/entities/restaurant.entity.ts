import { Column, Entity, OneToMany } from 'typeorm';
import {
  CommonEntity,
  RestaurantMenuEntity,
  RestaurantOperatingHoursEntity,
  UserPurchaseHistoryEntity,
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
    select: false,
  })
  cashBalance: number;

  @OneToMany(() => RestaurantMenuEntity, (menus) => menus.restaurant, {
    eager: true,
    cascade: true,
  })
  menus: RestaurantMenuEntity[];

  @OneToMany(
    () => UserPurchaseHistoryEntity,
    (purchaseHistories) => purchaseHistories.restaurant,
    {
      eager: true,
      cascade: true,
    },
  )
  purchaseHistories: UserPurchaseHistoryEntity[];

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
