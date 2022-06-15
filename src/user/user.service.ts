import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UpdateBalanceDto } from '../common/dto';
import { UserEntity } from '../database/entities';

@Injectable()
export class UserService {
  /**
   * It updates the user's balance by subtracting the total amount from the user's cash balance
   * @param {UpdateBalanceDto} params - UpdateBalanceDto
   */
  async updateBalance(params: UpdateBalanceDto): Promise<void> {
    const { id, totalAmount, entityManager } = params;

    const user = await entityManager
      .createQueryBuilder(UserEntity, 'user')
      .setLock('pessimistic_read')
      .where({ id })
      .getOne();

    if (!user) throw new UnprocessableEntityException('userNotFound');

    // check user balance
    if (user.cashBalance < totalAmount)
      throw new UnprocessableEntityException('insufficientBalance');

    await entityManager.update(UserEntity, id, {
      cashBalance: user.cashBalance - totalAmount,
    });
  }
}
