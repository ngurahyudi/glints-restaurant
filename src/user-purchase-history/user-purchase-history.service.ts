import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserPurchaseHistoryEntity } from '../database/entities';
import { UserPurchaseHistoryDto } from '../common/dto';

@Injectable()
export class UserPurchaseHistoryService {
  /**
   * It takes an array of UserPurchaseHistoryDto objects, and saves them to the database
   * @param {UserPurchaseHistoryDto[]} data - UserPurchaseHistoryDto[]: This is the data that we want
   * to save.
   * @param {EntityManager} entityManager - This is the entity manager that is injected into the
   * service.
   */
  async create(
    data: UserPurchaseHistoryDto[],
    entityManager: EntityManager,
  ): Promise<void> {
    await entityManager.save(
      entityManager.create(UserPurchaseHistoryEntity, data),
      { reload: false },
    );
  }
}
