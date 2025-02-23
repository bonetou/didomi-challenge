import { Test, TestingModule } from '@nestjs/testing';
import { GetUserUseCase } from './get-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import { User } from '../../domain/entities/user.entity';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetUserUseCase>(GetUserUseCase);
    userRepository = module.get('USER_REPOSITORY');
  });

  it('should return a user if found', async () => {
    const email = 'test@example.com';
    const userAggregate = new UserAggregate(new User('123', email));

    userRepository.findByEmail.mockResolvedValue(userAggregate);

    await expect(useCase.execute(email)).resolves.toEqual(userAggregate);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  it('should throw an error if user does not exist found', async () => {
    const email = 'test@example.com';
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(email)).rejects.toThrow(
      `User with email ${email} does not exist`,
    );
  });

  it('should throw an error if repository throws', async () => {
    const email = 'test@example.com';
    userRepository.findByEmail.mockRejectedValue(new Error('Database failure'));

    await expect(useCase.execute(email)).rejects.toThrow('Database failure');
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
  });
});
