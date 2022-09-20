import { IsNotEmpty } from 'class-validator';

export class RankDto {
  @IsNotEmpty()
  userId: number;
}
