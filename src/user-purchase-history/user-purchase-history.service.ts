import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserPurchaseHistoryEntity } from '../database/entities';
import { UserPurchaseHistoryDto } from '../common/dto';

@Injectable()
export class UserPurchaseHistoryService {
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
