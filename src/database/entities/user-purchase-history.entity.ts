import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity, UserEntity, RestaurantMenuEntity } from '.';

@Entity({ name: 'user_purchase_histories' })
export class UserPurchaseHistoryEntity extends CommonEntity {
  @Column({
    name: 'transaction_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  transactionAmount: number;

  @Column({ name: 'user_id' })
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.purchaseHistories)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'menu_id' })
  menuId: number;
  @ManyToOne(() => RestaurantMenuEntity, (menu) => menu.purchaseHistories)
  @JoinColumn({ name: 'menu_id' })
  menu: RestaurantMenuEntity;
}
