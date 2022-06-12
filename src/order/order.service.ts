import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getManager } from 'typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UserService } from '../user/user.service';
import { UserPurchaseHistoryService } from '../user-purchase-history/user-purchase-history.service';
import { OrderDto, OrderMenuDto, UserPurchaseHistoryDto } from '../common/dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly userService: UserService,
    private readonly userPurchaseHistoryService: UserPurchaseHistoryService,
    private readonly configService: ConfigService,
  ) {}

  private DATABASE_LOCK_RETRY: number =
    +this.configService.get<string>('database.lockRetry') || 5;

  private DATABASE_WAIT_RETRY: number =
    +this.configService.get<string>('database.waitRetry') || 1000;

  /**
   * It creates an order by updating the balance of the user and restaurant, and then creates a
   * purchase history for the user
   * @param {OrderDto} props - OrderDto
   * @param [retry=0] - number of times the function has been called
   * @returns A promise that resolves to an object with a message property.
   */
  async createOrder(props: OrderDto, retry = 0): Promise<{ message: string }> {
    const result = await getManager()
      .transaction(async (entityManager) => {
        // Get Total amount of purchased dishes
        const totalAmount: number = props.menus.reduce(
          (total: number, obj: OrderMenuDto) => {
            return total + obj.amount;
          },
          0,
        );

        await this.restaurantService.updateBalance(
          props.restaurantId,
          totalAmount,
          entityManager,
        );

        await this.userService.updateBalance(
          props.userId,
          totalAmount,
          entityManager,
        );

        const purchases: UserPurchaseHistoryDto[] = props.menus.map(
          (e: OrderMenuDto) => {
            return {
              transactionAmount: e.amount,
              menuId: e.menuId,
              userId: props.userId,
              restaurantId: props.restaurantId,
            };
          },
        );

        await this.userPurchaseHistoryService.create(purchases, entityManager);

        return {
          message: 'dataSuccessfullySaved',
        };
      })
      .catch(async (error) => {
        if (error.code === 'ER_LOCK_DEADLOCK') {
          if (retry >= this.DATABASE_LOCK_RETRY) {
            throw new InternalServerErrorException('deadLockFound');
          }

          await new Promise((r) => setTimeout(r, this.DATABASE_WAIT_RETRY));
          return this.createOrder(props, retry++);
        }

        throw error;
      });

    return result;
  }
}
