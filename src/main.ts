import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001'],
  });
  await app.listen(process.env.APP_HOST ?? 3000);
}

bootstrap();
