import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  const config = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('Users API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
