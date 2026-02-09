import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.enableCors();
  await app.listen(5001);
  console.log(`NestJS Pilot is running on: http://localhost:5001/api/v2`);
}
bootstrap();
