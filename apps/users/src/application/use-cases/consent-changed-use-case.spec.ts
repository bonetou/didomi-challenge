import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../domain/repositories/user.repository';
import { ConsentChangedEventDto } from '../../infrastructure/messaging/dto/consent-changed-event.dto';
import { Consent } from '../../domain/entities/consent.entity';
import { UserDoesNotExistError } from '../errors/user-does-not-exist.error';
import { ConsentChangedUseCase } from './consent-changed.use-case';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';

describe('ConsentChangedUseCase', () => {
  let useCase: ConsentChangedUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockConsentChangedDto: ConsentChangedEventDto = {
    userId: '00000000-0000-0000-0000-000000000000',
    consentId: 'email_notifications',
    enabled: true,
  };

  beforeEach(async () => {
    const userRepositoryMock: Partial<UserRepository> = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentChangedUseCase,
        { provide: 'USER_REPOSITORY', useValue: userRepositoryMock },
      ],
    }).compile();

    useCase = module.get<ConsentChangedUseCase>(ConsentChangedUseCase);
    userRepository = module.get('USER_REPOSITORY');
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should throw UserDoesNotExistError if user does not exist', async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(useCase.execute(mockConsentChangedDto)).rejects.toThrow(
        UserDoesNotExistError,
      );
    });

    it('should update user with new consent', async () => {
      const mockUser = {
        applyNewConsent: jest.fn(),
      } as unknown as UserAggregate;

      userRepository.findById.mockResolvedValue(mockUser);
      await useCase.execute(mockConsentChangedDto);
      expect(mockUser.applyNewConsent).toHaveBeenCalledWith(
        new Consent(
          mockConsentChangedDto.userId,
          mockConsentChangedDto.consentId,
          mockConsentChangedDto.enabled,
        ),
      );
      expect(userRepository.update).toHaveBeenCalledWith(mockUser);
    });
  });
});
