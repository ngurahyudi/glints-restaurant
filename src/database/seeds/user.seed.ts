import axios from 'axios';
import { getRepository } from 'typeorm';
import { Seeder } from 'typeorm-seeding';
import * as moment from 'moment';
import { RestaurantMenuEntity, UserEntity } from '../entities';
import { UserLoadType } from '../../common/types';
import { UserDto, UserPurchaseHistoryDto } from '../../common/dto';
import { proper } from '../../common/helpers';

export default class UserSeed implements Seeder {
  public async run(): Promise<void> {
    const userRepository = getRepository(UserEntity);
    const menuRepository = getRepository(RestaurantMenuEntity);

    const recordCount = await userRepository.count();
    if (recordCount > 0) return;

    const request = await axios.get(
      'https://gist.githubusercontent.com/seahyc/de33162db680c3d595e955752178d57d/raw/785007bc91c543f847b87d705499e86e16961379/users_with_purchase_history.json',
    );

    const data: UserLoadType[] = request.data;

    const users: UserDto[] = [];

    for (const usr of data) {
      const histories: UserPurchaseHistoryDto[] = [];

      for (const hist of usr.purchaseHistory) {
        const restaurantName = hist.restaurantName;
        const dishName = hist.dishName;

        const menu = await menuRepository
          .createQueryBuilder('menu')
          .select('menu')
          .innerJoin('menu.restaurant', 'restaurant')
          .where('menu.name=:dishName', { dishName })
          .andWhere('restaurant.name=:restaurantName', { restaurantName })
          .getOne();

        const history: UserPurchaseHistoryDto = {
          transactionAmount: +hist.transactionAmount,
          transactionDate: new Date(
            moment(hist.transactionDate, 'MM/DD/YYYY h:m:s A').format(
              'YYYY-MM-DD HH:mm:ss',
            ),
          ),
          restaurantId: menu.restaurantId,
          menuId: menu.id,
        };

        histories.push(history);
      }

      const user = new UserDto();
      user.id = usr.id;
      user.name = proper(usr.name);
      user.cashBalance = usr.cashBalance;
      user.purchaseHistories = histories;

      users.push(user);
    }

    await userRepository.save(userRepository.create(users));
  }
}
