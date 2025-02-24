import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

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

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new HttpException(
          {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: errors.map(
              (e) =>
                `${e.property}: ${Object.values(e.constraints || {}).join()}`,
            ),
            error: 'Unprocessable Entity',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    }),
  );

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
