import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfig } from './config/typeorm.config';
import { RaidModule } from './raid/raid.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UserModule, RaidModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
