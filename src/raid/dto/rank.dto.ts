import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class RankDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: '사용자 pk',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly userId: number;
}
