import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { RaidRecord } from './entity/raid.entity';
import { RaidController } from './raid.controller';
import { RaidService } from './raid.service';
import redisStore from 'cache-manager-ioredis';
import * as config from 'config';
import { RedisModule } from '@nestjs-modules/ioredis';

const redisConfig = config.get('redis');

@Module({
  imports: [
    TypeOrmModule.forFeature([RaidRecord]),
    UserModule,
    HttpModule,
    CacheModule.register({
      store: redisStore,
      host: redisConfig.host,
      port: redisConfig.port,
    }),
    RedisModule.forRoot({
      config: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
    }),
  ],
  controllers: [RaidController],
  providers: [RaidService],
})
export class RaidModule {}
