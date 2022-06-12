import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, getManager, Repository } from 'typeorm';
import * as moment from 'moment';
import { RestaurantEntity, RestaurantMenuEntity } from '../database/entities';
import { DaysEnum, MoreLessEnum } from '../common/enums';
import { IDataTable } from '../common/interfaces';
import { selectQuery } from '../common/helpers';
import { DishesByPriceType, RestaurantType } from '../common/types';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(RestaurantMenuEntity)
    private readonly restaurantMenuRepository: Repository<RestaurantMenuEntity>,
  ) {}

  /**
   * It updates the cash balance of a restaurant by adding the total amount of the order to the current
   * cash balance
   * @param {number} restaurantId - number,
   * @param {number} totalAmount - The amount to be added to the balance.
   * @param {EntityManager} entityManager - This is the entity manager that is used to perform the
   * database operations.
   * @returns The restaurant entity with the updated cash balance.
   */
  async updateBalance(
    restaurantId: number,
    totalAmount: number,
    entityManager: EntityManager,
  ): Promise<void> {
    const restaurant = await entityManager
      .createQueryBuilder(RestaurantEntity, 'restaurant')
      .addSelect('restaurant.cashBalance')
      .setLock('pessimistic_read')
      .where({ id: restaurantId })
      .getOne();

    if (!restaurant)
      throw new UnprocessableEntityException('restaurantNotFound');

    await entityManager.update(RestaurantEntity, restaurantId, {
      cashBalance: restaurant.cashBalance + totalAmount,
    });
  }

  /**
   * It returns a list of restaurants that are open at a given date and time
   * @param {string} dateTime - string - the date and time to check if the restaurant is open
   * @param {IDataTable} dataTableOptions - IDataTable
   * @returns An array of restaurants and the count of restaurants.
   */
  async listByDateTime(
    dateTime: string,
    dataTableOptions: IDataTable,
  ): Promise<[RestaurantType[], number]> {
    const dt = moment(dateTime);

    if (!dt.isValid()) {
      throw new UnprocessableEntityException('invalidDateTime');
    }

    const day: DaysEnum = DaysEnum[dt.format('dddd').toUpperCase()];

    const time = dt.format('HH:mm:ss');

    try {
      let query = this.restaurantRepository
        .createQueryBuilder('restaurant')
        .innerJoin('restaurant.operatingHours', 'operatingHours')
        /*
            uncomment this to show the operating hours
            .innerJoinAndSelect('restaurant.operatingHours', 'operatingHours')
            uncomment this to show the menus
            .innerJoinAndSelect('restaurant.menus', 'menus')
        */
        .where('operatingHours.day=:day', { day })
        .andWhere(':time >= operatingHours.openTime', { time })
        .andWhere(':time < operatingHours.closeTime', { time });

      if (dataTableOptions.filterBy) {
        query = selectQuery(
          query,
          dataTableOptions.filterOperator,
          dataTableOptions.filterBy,
          dataTableOptions.filterValue,
        );
      }

      const skip = dataTableOptions.pageSize * dataTableOptions.pageIndex || 0;

      const result = await query
        .skip(skip)
        .take(dataTableOptions.pageSize)
        .orderBy(
          `restaurant.${dataTableOptions.sortBy}`,
          dataTableOptions.sortOrder,
        )
        .select('restaurant')
        .getManyAndCount();

      return [result[0] as RestaurantType[], result[1]];
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * "Get the top restaurants with the most dishes in a price range."
   *
   * The function takes in the following parameters:
   *
   * take: number - The number of restaurants to return.
   * operator: MoreLessEnum - The operator to use for the top parameter.
   * top: number - The number of dishes to use for the operator.
   * priceStart: number - The starting price of the dishes.
   * priceEnd: number - The ending price of the dishes.
   * The function returns a promise of an array of DishesByPrice objects
   * @param {number} show - number - The number of restaurants to return
   * @param {MoreLessEnum} operator - MoreLessEnum.MORE or MoreLessEnum.LESS
   * @param {number} totalDishesWithinPriceRange - number,
   * @param {number} priceStarts - The minimum price of the dish
   * @param {number} priceEnds - number,
   * @returns An array of objects with the following structure:
   */
  async listByPriceRange(
    show: number,
    operator: MoreLessEnum,
    totalDishesWithinPriceRange: number,
    priceStarts: number,
    priceEnds: number,
  ): Promise<DishesByPriceType[]> {
    let query = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoin('restaurant.menus', 'menus')
      .where('menus.price BETWEEN :priceStarts AND :priceEnds', {
        priceStarts,
        priceEnds,
      })
      .groupBy('restaurant.id')
      .addGroupBy('restaurant.name');

    switch (operator) {
      case MoreLessEnum.MORE:
        query = query.having('COUNT(*) > :totalDishesWithinPriceRange', {
          totalDishesWithinPriceRange,
        });
        break;

      case MoreLessEnum.LESS:
        query = query.having('COUNT(*) < :totalDishesWithinPriceRange', {
          totalDishesWithinPriceRange,
        });
        break;
    }

    try {
      return await query
        .orderBy('restaurant.name', 'ASC')
        .limit(show)
        .select('restaurant.id', 'id')
        .addSelect('restaurant.name', 'name')
        .addSelect('COUNT(*)', 'totalDishes')
        .getRawMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * It takes a keyword as an argument and returns a list of restaurants and dishes that match the
   * keyword
   * @param {string} keyword - string - The keyword to search for.
   * @returns An array of objects with a name property.
   */
  async filterRestaurantsAndDishesByName(keyword: string): Promise<any> {
    const restaurantQry = this.restaurantRepository
      .createQueryBuilder('restaurant')
      .select('restaurant.name', 'name')
      .where(`restaurant.name LIKE '%${keyword}%'`)
      .getQuery();

    const dishQry = this.restaurantMenuRepository
      .createQueryBuilder('dish')
      .select('dish.name', 'name')
      .where(`dish.name LIKE '%${keyword}%'`)
      .getQuery();

    try {
      return await getManager().query(`${restaurantQry} UNION ${dishQry}`);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
