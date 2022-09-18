import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaidRecord } from './entity/raid.entity';

@Module({ imports: [TypeOrmModule.forFeature([RaidRecord])] })
export class RaidModule {}
