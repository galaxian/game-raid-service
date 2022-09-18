import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidRecord } from './entity/raid.entity';
import { RaidController } from './raid.controller';
import { RaidService } from './raid.service';

@Module({ imports: [TypeOrmModule.forFeature([RaidRecord])], controllers: [RaidController], providers: [RaidService] })
export class RaidModule {}
