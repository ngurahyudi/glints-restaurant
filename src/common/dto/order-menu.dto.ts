import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderMenuDto {
  @ApiProperty({ example: 25 })
  @IsNumber()
  @IsNotEmpty()
  menuId: number;

  @ApiProperty({ example: 4.2 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
