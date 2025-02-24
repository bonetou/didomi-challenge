import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GlobalValidationPipe } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const rabbitMQUrl = configService.getOrThrow<string>('RABBITMQ_URL');
  const rabbitMQQueue = configService.getOrThrow<string>(
    'RABBITMQ_CONSUME_QUEUE',
  );
  const port = configService.getOrThrow<number>('PORT');

  app.useGlobalPipes(new GlobalValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('Users API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: rabbitMQQueue,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
}

void bootstrap();
