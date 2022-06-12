import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../database/entities';

@Injectable()
export class UserService {
  /**
   * It locks the user row, checks if the user has enough balance, and if so, updates the user's
   * balance
   * @param {number} userId - The user's id
   * @param {number} totalAmount - The total amount of the transaction.
   * @param {EntityManager} entityManager - EntityManager
   * @returns The user entity with the updated cash balance.
   */
  async updateBalance(
    userId: number,
    totalAmount: number,
    entityManager: EntityManager,
  ): Promise<void> {
    const user = await entityManager
      .createQueryBuilder(UserEntity, 'user')
      .setLock('pessimistic_read')
      .where({ id: userId })
      .getOne();

    if (!user) throw new UnprocessableEntityException('userNotFound');

    // check user balance
    if (user.cashBalance < totalAmount)
      throw new UnprocessableEntityException('insufficientBalance');

    await entityManager.save(
      entityManager.create(UserEntity, {
        ...user,
        cashBalance: user.cashBalance - totalAmount,
      }),
      { reload: false },
    );
  }
}
