import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from './delete-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { EventBus } from '../events/event-bus.interface';
import { UserEvents } from '../../domain/events/user-events.enum';
import { UserDeletedEvent } from '../../domain/events/user-deleted.event';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findByEmail: jest.fn().mockResolvedValue({
              user: { id: '123' },
            }),
            delete: jest.fn().mockResolvedValue(undefined),
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

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    userRepository = module.get('USER_REPOSITORY');
    eventBus = module.get('EVENT_BUS');
  });

  it('should delete a user and publish an event', async () => {
    const email = 'test@example.com';

    await expect(useCase.execute(email)).resolves.toBeUndefined();

    expect(userRepository.delete).toHaveBeenCalledTimes(1);
    expect(userRepository.delete).toHaveBeenCalledWith(email);

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith(
      UserEvents.UserDeleted,
      new UserDeletedEvent('123', email),
    );
  });

  it('should do nothing if the user does not exist', async () => {
    const email = 'non-existing@example.com';
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(email)).resolves.toBeUndefined();

    expect(userRepository.delete).not.toHaveBeenCalled();
    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('should throw an error if deleting the user fails', async () => {
    const email = 'test@example.com';
    userRepository.delete.mockRejectedValue(new Error('Database failure'));

    await expect(useCase.execute(email)).rejects.toThrow('Database failure');

    expect(userRepository.delete).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
