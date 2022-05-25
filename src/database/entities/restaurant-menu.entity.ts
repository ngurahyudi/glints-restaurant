import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity, RestaurantEntity, UserPurchaseHistoryEntity } from './';

@Entity({ name: 'restaurant_menus' })
export class RestaurantMenuEntity extends CommonEntity {
  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.menus)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantEntity;

  @OneToMany(
    () => UserPurchaseHistoryEntity,
    (purchaseHistories) => purchaseHistories.menu,
    {
      eager: true,
      cascade: true,
    },
  )
  purchaseHistories: UserPurchaseHistoryEntity[];
}
