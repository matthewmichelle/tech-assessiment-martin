import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  // somewhere in your initialization file
  app.useGlobalFilters(new HttpExceptionFilter());

  // Use the custom ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  // Read swaggerConfig.json file
  const rawData = fs.readFileSync('swagger.config.json', 'utf8');
  const configData = JSON.parse(rawData);

  const config = new DocumentBuilder()
    .setTitle(configData.title)
    .setDescription(configData.description)
    .setVersion(configData.version)
    .addBearerAuth(
      {
        type: configData.auth_type,
        scheme: configData.auth_scheme,
        bearerFormat: configData.auth_scheme_format,
        name: 'Authorization',
        in: 'header',
      },
      configData.auth_token,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Get port from ConfigService
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
}

bootstrap();
