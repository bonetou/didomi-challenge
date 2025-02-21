import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { EventBus } from '../events/event-bus.interface';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import { UserCreatedEvent } from '../../domain/events/user-created.event';
import { UserEvents } from '../../domain/events/user-events.enum';
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            create: jest.fn().mockResolvedValue(undefined),
            exists: jest.fn().mockResolvedValue(false),
          },
        },
        {
          provide: 'EVENT_BUS',
          useValue: {
            publish: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get('USER_REPOSITORY');
    eventBus = module.get('EVENT_BUS');

    (randomUUID as jest.Mock).mockReturnValue(
      '00000000-0000-0000-0000-000000000000',
    );
  });

  it('should create a user and publish an event', async () => {
    const email = 'test@example.com';
    const userAggregate = UserFactory.create(email);

    await expect(useCase.execute(email)).resolves.toEqual(userAggregate);

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.any(UserAggregate),
    );

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith(
      UserEvents.UserCreated,
      new UserCreatedEvent(userAggregate.user.id, userAggregate.user.email),
    );
  });

  it('should throw an error if the user already exists', async () => {
    const email = 'test@example.com';
    userRepository.exists.mockResolvedValue(true);

    await expect(useCase.execute(email)).rejects.toThrow(
      `User with email ${email} already exists`,
    );

    expect(userRepository.create).not.toHaveBeenCalled();
    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('should throw an error if saving the user fails', async () => {
    const email = 'test@example.com';
    userRepository.create.mockRejectedValue(new Error('Database failure'));

    await expect(useCase.execute(email)).rejects.toThrow('Database failure');

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
