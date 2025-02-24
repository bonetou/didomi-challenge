import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ConsentChangedEventDto } from './dto/consent-changed-event.dto';
import { ConsentChangedUseCase } from '../../application/use-cases/consent-changed.use-case';

@Controller()
export class ConsentEventsListener {
  constructor(private readonly consentChangedUseCase: ConsentChangedUseCase) {}
  @EventPattern('consent.changed')
  async handleConsentChanged(@Payload() data: ConsentChangedEventDto) {
    await this.consentChangedUseCase.execute(data);
  }
}
