import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { OrderDto } from '../common/dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary:
      'Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction',
  })
  @ApiBody({ type: OrderDto, description: 'Create user order' })
  @HttpCode(HttpStatus.CREATED)
  createOrder(
    @Body()
    props: OrderDto,
  ) {
    return this.orderService.createOrder(props);
  }
}
