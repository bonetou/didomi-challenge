import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GlobalValidationPipe } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const rabbitMQUrl = configService.getOrThrow<string>('RABBITMQ_URL');
  const rabbitMqConsumeQueue = configService.getOrThrow<string>(
    'RABBITMQ_CONSUME_QUEUE',
  );
  const port = configService.getOrThrow<number>('PORT');

  const config = new DocumentBuilder()
    .setTitle('Consents')
    .setDescription('Consents API')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(new GlobalValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: rabbitMqConsumeQueue,
      queueOptions: {
        durable: true,
      },
    },
  });

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.startAllMicroservices();
  await app.listen(port);
}
void bootstrap();
