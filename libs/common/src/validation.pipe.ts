import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
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
    });
  }
}
