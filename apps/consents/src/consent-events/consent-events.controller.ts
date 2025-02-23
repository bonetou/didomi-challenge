import { Body, Controller, Post } from '@nestjs/common';
import { ConsentEventsService } from './consent-events.service';
import { CreateConsentEventDto } from './dto/create-consent-event.dto';

@Controller('events')
export class ConsentsController {
  constructor(private readonly consentsService: ConsentEventsService) {}

  @Post()
  processConsentEvent(@Body() consentEventDto: CreateConsentEventDto) {
    return this.consentsService.processConsentEvent(consentEventDto);
  }
}
