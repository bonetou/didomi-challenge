import { Inject, Injectable } from '@nestjs/common';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFactory } from '../../domain/factories/user.factory';
import { UseCase } from './use-case.interface';
import { EventBus } from '../events/event-bus.interface';
import { UserEvents } from '../../domain/events/user-events.enum';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

@Injectable()
export class CreateUserUseCase implements UseCase<string, UserAggregate> {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    @Inject('EVENT_BUS')
    private readonly eventBus: EventBus,
  ) {}

  async execute(email: string): Promise<UserAggregate> {
    const userAggregate = UserFactory.create(email);

    await this.userRepository.create(userAggregate);
    await this.eventBus.publish(
      UserEvents.UserCreated,
      new UserCreatedEvent(userAggregate.user.id, userAggregate.user.email),
    );

    return userAggregate;
  }
}
