import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { RaidRecord } from './entity/raid.entity';
import { RaidController } from './raid.controller';
import { RaidService } from './raid.service';

@Module({
  imports: [TypeOrmModule.forFeature([RaidRecord]), UserModule, HttpModule],
  controllers: [RaidController],
  providers: [RaidService],
})
export class RaidModule {}
