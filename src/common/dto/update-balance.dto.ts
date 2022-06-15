import { EntityManager } from 'typeorm';

export class UpdateBalanceDto {
  id: number;
  totalAmount: number;
  entityManager: EntityManager;
}
