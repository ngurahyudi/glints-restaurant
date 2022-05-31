import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { UserPurchaseHistoryEntity } from '.';

@Entity({ name: 'users' })
export class UserEntity {
  __entity?: string;

  @PrimaryColumn()
  id: number;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @Column({ length: 25, name: 'created_by', default: 'SYSTEM', select: false })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  @Column({ length: 25, name: 'updated_by', default: 'SYSTEM', select: false })
  updatedBy: string;

  @DeleteDateColumn({ name: 'deleted_date', nullable: true })
  deletedDate: Date;

  @VersionColumn({ name: 'data_version' })
  version: number;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }

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
