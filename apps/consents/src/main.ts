import { NestFactory } from '@nestjs/core';
import { ConsentsModule } from './consents.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsentsModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
