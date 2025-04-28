/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('TresFlix API')
    .setDescription('The TresFlix API description')
    .setVersion('1.0')
    .addCookieAuth()
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);

  app.use('/docs', apiReference({ spec: { content: document } }));
  app.use('/actors', express.static(`${configService.get('folders')}/actors`));
  app.use('/movies', express.static(`${configService.get('folders')}/movies`));

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  await app.listen(configService.get('port')!);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
