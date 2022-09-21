import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class EndRaidDto {
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
    example: 1,
    description: '보스 레이드 pk',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly raidRecordId: number;
}
