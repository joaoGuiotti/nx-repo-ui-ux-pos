import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const globalPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(globalPrefix);

  const corsOrigins = configService.get<string>('CORS_ORIGIN', 'http://localhost:4200');
  app.enableCors({
    origin: corsOrigins.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CFP Platform API')
    .setDescription('API backend REST para submissão de palestrantes e palestras (Call for Papers)')
    .setVersion('1.0.0')
    .addTag('cfp')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  Logger.log(`🚀 Application running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 Swagger documentation available on: http://localhost:${port}/docs`);
}

bootstrap();
