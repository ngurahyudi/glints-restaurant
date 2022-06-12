import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseEnumPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MoreLessEnum, OperatorEnum, SortEnum } from '../common/enums';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  /*--------------------------------------------------------------------------------*/
  @Get('availability')
  @ApiOperation({
    summary: 'List all restaurants that are open at a certain datetime',
  })
  @ApiQuery({
    name: 'dateTime',
    type: 'string',
    required: true,
    example: '2022-05-29T16:20:00',
  })
  @ApiQuery({
    name: 'filterBy',
    type: 'string',
    required: false,
    example: 'name',
  })
  @ApiQuery({
    name: 'filterOperator',
    enum: OperatorEnum,
    required: false,
    example: OperatorEnum.CONTAINS,
  })
  @ApiQuery({
    name: 'filterValue',
    type: 'string',
    required: false,
    example: 'mexican',
  })
  @ApiQuery({
    name: 'sortBy',
    type: 'string',
    required: false,
    example: 'name',
  })
  @ApiQuery({
    name: 'sortOrder',
    enum: SortEnum,
    required: false,
    example: SortEnum.ASC,
  })
  @ApiQuery({
    name: 'pageIndex',
    type: 'number',
    required: false,
    example: 0,
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'number',
    required: false,
    example: 10,
  })
  listByDateTime(
    @Query('dateTime') dateTime: string,
    @Query('filterBy') filterBy: string,
    @Query(
      'filterOperator',
      new DefaultValuePipe(OperatorEnum.CONTAINS),
      new ParseEnumPipe(OperatorEnum),
    )
    filterOperator: OperatorEnum,
    @Query('filterValue') filterValue: string,
    @Query('sortBy', new DefaultValuePipe('name')) sortBy: string,
    @Query(
      'sortOrder',
      new DefaultValuePipe(SortEnum.ASC),
      new ParseEnumPipe(SortEnum),
    )
    sortOrder: SortEnum,
    @Query('pageIndex', new DefaultValuePipe(0), ParseIntPipe)
    pageIndex: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    if (pageSize > 50) pageSize = 50;

    return this.restaurantService.listByDateTime(dateTime, {
      filterBy,
      filterOperator,
      filterValue,
      sortBy,
      sortOrder,
      pageIndex,
      pageSize,
    });
  }
  /*--------------------------------------------------------------------------------*/

  @Get('filter')
  @ApiOperation({
    summary:
      'List top y restaurants that have more or less than x number of dishes within a price range, ranked alphabetically',
  })
  @ApiQuery({
    name: 'show',
    description: 'Show top y restaurants',
    type: 'number',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'operator',
    enum: MoreLessEnum,
    required: false,
    example: MoreLessEnum.MORE,
  })
  @ApiQuery({
    name: 'totalDishesWithinPriceRange',
    description:
      'Show more or less than x number of dishes within a price range',
    type: 'number',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'priceStarts',
    type: 'number',
    required: false,
    example: '0.0',
  })
  @ApiQuery({
    name: 'priceEnds',
    type: 'number',
    required: false,
    example: '10.0',
  })
  listByFilter(
    @Query('show', new DefaultValuePipe(10), ParseIntPipe) show: number,
    @Query(
      'operator',
      new DefaultValuePipe(MoreLessEnum.MORE),
      new ParseEnumPipe(MoreLessEnum),
    )
    operator: MoreLessEnum,
    @Query(
      'totalDishesWithinPriceRange',
      new DefaultValuePipe(10),
      ParseIntPipe,
    )
    totalDishesWithinPriceRange: number,
    @Query('priceStarts', new DefaultValuePipe(0.0), ParseFloatPipe)
    priceStarts: number,
    @Query('priceEnds', new DefaultValuePipe(10.0), ParseFloatPipe)
    priceEnds: number,
  ) {
    return this.restaurantService.listByPriceRange(
      show,
      operator,
      totalDishesWithinPriceRange,
      priceStarts,
      priceEnds,
    );
  }
  /*--------------------------------------------------------------------------------*/

  @Get('search')
  @ApiOperation({
    summary:
      'Search for restaurants or dishes by name, ranked by relevance to search term',
  })
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: true,
    example: 'bacon',
  })
  filterRestaurantsAndDishesByName(@Query('keyword') keyword: string) {
    return this.restaurantService.filterRestaurantsAndDishesByName(keyword);
  }
}
