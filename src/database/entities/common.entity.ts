import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export class CommonEntity extends BaseEntity {
  __entity?: string;

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @Column({ length: 25, name: 'created_by', default: 'SYSTEM', select: false })
  createdBy: string;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @Column({ length: 25, name: 'updated_by', default: 'SYSTEM', select: false })
  updatedBy: string;

  @DeleteDateColumn({ name: 'deleted_date', nullable: true, select: false })
  deletedDate: Date;

  @VersionColumn({ name: 'data_version', select: false })
  version: number;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }
}
