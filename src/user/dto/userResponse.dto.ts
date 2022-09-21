import { RaidStatusResponseDto } from 'src/raid/dto/raidStatusRes.dto';

export class UserResponseDto {
  totalScore: number;
  bossRaidHistory: RaidStatusResponseDto[];
}
