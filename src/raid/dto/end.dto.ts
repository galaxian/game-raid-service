import { IsNotEmpty } from 'class-validator';

export class EndRaidDto {
  @IsNotEmpty()
  readonly userId: number;

  @IsNotEmpty()
  readonly raidRecordId: number;
}
