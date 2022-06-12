import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { OrderMenuDto } from '.';

export class OrderDto {
  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 14 })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({
    description: 'List of ordered dishes',
    type: () => [OrderMenuDto],
  })
  @Type(() => OrderMenuDto)
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  menus: OrderMenuDto[];
}
