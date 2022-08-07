import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as moment from 'moment';
import { RestaurantEntity, RestaurantMenuEntity } from '../database/entities';
import { DaysEnum, MoreLessEnum } from '../common/enums';
import { selectQuery } from '../common/helpers';
import { DishesByPriceType, RestaurantType, SearchType } from '../common/types';
import { ListRestaurantByDateTimeDto, UpdateBalanceDto } from '../common/dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(RestaurantMenuEntity)
    private readonly restaurantMenuRepository: Repository<RestaurantMenuEntity>,
    @InjectEntityManager() private manager: EntityManager,
  ) {}

  /**
   * It updates the cash balance of a restaurant by adding the total amount of an order to it
   * @param {UpdateBalanceDto} params - UpdateBalanceDto
   */
  async updateBalance(params: UpdateBalanceDto): Promise<void> {
    const { id, totalAmount, entityManager } = params;

    const restaurant = await entityManager
      .createQueryBuilder(RestaurantEntity, 'restaurant')
      .addSelect('restaurant.cashBalance')
      .setLock('pessimistic_read')
      .where({ id })
      .getOne();

    if (!restaurant) throw new BadRequestException('restaurantNotFound');

    await entityManager.update(RestaurantEntity, id, {
      cashBalance: restaurant.cashBalance + totalAmount,
    });
  }

  /**
   * It returns a list of restaurants that are open at a given date and time
   * @param {ListRestaurantByDateTimeDto} queryParams - ListRestaurantByDateTimeDto
   * @returns an array of two elements. The first element is an array of RestaurantType objects. The
   * second element is the number of records.
   */
  async listByDateTime(
    queryParams: ListRestaurantByDateTimeDto,
  ): Promise<[RestaurantType[], number]> {
    const dt = moment(queryParams.dateTime);

    if (!dt.isValid()) {
      throw new BadRequestException('invalidDateTime');
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

      if (queryParams.dataTableOptions.filterBy) {
        query = selectQuery(
          query,
          'restaurant',
          queryParams.dataTableOptions.filterOperator,
          queryParams.dataTableOptions.filterBy,
          queryParams.dataTableOptions.filterValue,
        );
      }

      const skip =
        queryParams.dataTableOptions.pageSize *
          queryParams.dataTableOptions.pageIndex || 0;

      const result = await query
        .skip(skip)
        .take(queryParams.dataTableOptions.pageSize)
        .orderBy(
          `restaurant.${queryParams.dataTableOptions.sortBy}`,
          queryParams.dataTableOptions.sortOrder,
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
  async filterRestaurantsAndDishesByName(
    keyword: string,
  ): Promise<SearchType[]> {
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
      return await this.manager.query(`${restaurantQry} UNION ${dishQry}`);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
