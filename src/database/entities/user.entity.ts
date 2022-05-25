import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity, UserPurchaseHistoryEntity } from '.';

@Entity({ name: 'users' })
export class UserEntity extends CommonEntity {
  @Column()
  name: string;

  @Column()
  cashBalance: number;

  @OneToMany(
    () => UserPurchaseHistoryEntity,
    (purchaseHistories) => purchaseHistories.user,
    {
      eager: true,
      cascade: true,
    },
  )
  purchaseHistories: UserPurchaseHistoryEntity[];
}
