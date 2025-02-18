import { Controller, Get } from '@nestjs/common';
import { ConsentsService } from './consents.service';

@Controller()
export class ConsentsController {
  constructor(private readonly consentsService: ConsentsService) {}

  @Get()
  getHello(): string {
    return this.consentsService.getHello();
  }
}
