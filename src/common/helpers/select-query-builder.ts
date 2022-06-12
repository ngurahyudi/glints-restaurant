import { SelectQueryBuilder } from 'typeorm';
import { OperatorEnum } from '../enums';

/**
 * It takes a query builder, an operator, a filter, and a value, and returns a query builder with the
 * filter applied
 * @param queryBuilder - The query builder object that we are using to build our query.
 * @param {string} operator - The operator to use for the query.
 * @param {string} filter - The name of the column to filter on.
 * @param {any} value - The value of the filter.
 * @returns A function that takes in a queryBuilder, operator, filter, and value.
 */
export const selectQuery = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  operator: OperatorEnum,
  filter: string,
  value: any,
) => {
  let qry: SelectQueryBuilder<T>;
  switch (operator) {
    case OperatorEnum.CONTAINS:
      qry = queryBuilder.andWhere(`restaurant.${filter} LIKE :filter`, {
        filter: '%' + value + '%',
      });
      break;
    case OperatorEnum.EQUALS:
      qry = queryBuilder.andWhere(`restaurant.${filter} = :filter`, {
        filter: value,
      });
      break;
    case OperatorEnum.STARTS_WITH:
      qry = queryBuilder.andWhere(`restaurant.${filter} LIKE :filter`, {
        filter: value + '%',
      });
      break;
    default:
      qry = queryBuilder.andWhere(`restaurant.${filter} LIKE :filter`, {
        filter: '%' + value,
      });
  }

  return qry;
};
