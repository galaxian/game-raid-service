import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';

const serverConfig = config.get('server');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = serverConfig.port;

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.setGlobalPrefix('/api');

  setupSwagger(app);
  await app.listen(port);
}
bootstrap();
