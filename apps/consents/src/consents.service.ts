import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsentsService {
  getHello(): string {
    return 'Hello World!';
  }
}
