import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from 'process';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipNullProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  app.enableCors({
    origin: env.FRONT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('Bank Lite')
    .setDescription('This is the OpenAPI specifications for the Bank Lite API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.set('trust proxy', 'loopback');
  await app.listen(3000);
}
void bootstrap();
