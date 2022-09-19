import { IsNotEmpty } from 'class-validator';

export class EndRaidDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  raidRecordId: number;
}
