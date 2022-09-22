import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class EnterRaidDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: '사용자 pk',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly userId: number;

  @ApiProperty({
    type: Number,
    example: 2,
    description: '레이드 보스 레벨',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly level: number;
}
