import { Inject, Injectable } from '@nestjs/common';
import { CreateConsentEventDto } from './dto/create-consent-event.dto';
import { EventBus } from '@app/messaging';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsentCreatedEvent } from './events/consent-created.event';
import { ConsentEvents } from './events/consent-events.enum';
import { ConsentEvent } from './entities/consent-events.entity';

@Injectable()
export class ConsentEventsService {
  constructor(
    @InjectRepository(ConsentEvent)
    private readonly consentRepository: Repository<ConsentEvent>,
    @Inject('EVENT_BUS')
    private readonly eventBus: EventBus,
  ) {}

  async processConsentEvent(consentEventDto: CreateConsentEventDto) {
    await this.consentRepository.save({
      userId: consentEventDto.userId,
      consentId: consentEventDto.consentId,
      enabled: consentEventDto.enabled,
    });
    this.publishConsentEvent(consentEventDto);
  }

  publishConsentEvent(consentEventDto: CreateConsentEventDto) {
    const event: ConsentCreatedEvent = { ...consentEventDto };
    this.eventBus.publish(ConsentEvents.ConsentCreated, event);
  }
}
