import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConsentEventDto } from './dto/create-consent-event.dto';
import { EventBus } from '@app/messaging';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsentChangedEvent } from './events/consent-changed.event';
import { ConsentEvents } from './events/consent-events.enum';
import { ConsentEvent } from './entities/consent-events.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class ConsentEventsService {
  constructor(
    @InjectRepository(ConsentEvent)
    private readonly consentRepository: Repository<ConsentEvent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('EVENT_BUS')
    private readonly eventBus: EventBus,
  ) {}

  async processConsentEvent(consentEventDto: CreateConsentEventDto) {
    const user = await this.userRepository.findOne({
      where: { id: consentEventDto.userId },
      withDeleted: false,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.consentRepository.save({
      userId: consentEventDto.userId,
      consentId: consentEventDto.consentId,
      enabled: consentEventDto.enabled,
    });
    this.publishConsentEvent(consentEventDto);
  }

  publishConsentEvent(consentEventDto: CreateConsentEventDto) {
    const event: ConsentChangedEvent = { ...consentEventDto };
    this.eventBus.publish(ConsentEvents.ConsentChanged, event);
  }

  async createUser(createUserDto: CreateUserDto) {
    const recreatedUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    if (recreatedUser) {
      await this.userRepository.update(recreatedUser.id, {
        deletedAt: null,
        id: createUserDto.userId,
      });
      return;
    }

    await this.userRepository.save({
      id: createUserDto.userId,
      email: createUserDto.email,
    });
  }

  async softDeleteUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.softDelete(userId);
  }
}
