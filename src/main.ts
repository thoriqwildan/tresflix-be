import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('TresFlix API')
    .setDescription('The TresFlix API description')
    .setVersion('1.0')
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use('/docs', apiReference({ spec: { content: document } }));

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('port')!);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
