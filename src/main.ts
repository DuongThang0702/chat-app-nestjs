import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT, URL_CLIENT } = process.env;
  app.use(cookieParser());
  app.enableCors({
    origin: URL_CLIENT,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () => console.log(`app running with port: ${PORT}`));
}
bootstrap();
