import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UseCase } from './use-case.interface';
import { UserEvents } from '../../domain/events/user-events.enum';
import { UserDeletedEvent } from '../../domain/events/user-deleted.event';
import { EventBus } from '@app/messaging';

@Injectable()
export class DeleteUserUseCase implements UseCase<string, void> {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    @Inject('EVENT_BUS')
    private readonly eventBus: EventBus,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }
    await this.userRepository.delete(email);
    this.eventBus.publish(
      UserEvents.UserDeleted,
      new UserDeletedEvent(user.user.id, email),
    );
  }
}
