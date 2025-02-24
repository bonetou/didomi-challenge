import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ConsentEventsService } from './consent-events.service';
import { ConsentEvent } from './entities/consent-events.entity';
import { User } from './entities/user.entity';
import { EventBus } from '@app/messaging';
import { ConsentEvents } from './events/consent-events.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateConsentEventDto } from './dto/create-consent-event.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ConsentId } from './enums/consent-ids.enum';

describe('ConsentEventsService', () => {
  let service: ConsentEventsService;
  let consentRepository: jest.Mocked<Repository<ConsentEvent>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let eventBus: jest.Mocked<EventBus>;

  const mockConsentEventDto: CreateConsentEventDto = {
    userId: '1',
    consentId: ConsentId.EMAIL_NOTIFICATIONS,
    enabled: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentEventsService,
        {
          provide: getRepositoryToken(ConsentEvent),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            softDelete: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: 'EVENT_BUS',
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConsentEventsService>(ConsentEventsService);
    consentRepository = module.get(getRepositoryToken(ConsentEvent));
    userRepository = module.get(getRepositoryToken(User));
    eventBus = module.get('EVENT_BUS');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processConsentEvent', () => {
    it('should save consent event and publish event', async () => {
      userRepository.findOne.mockResolvedValue({ id: '1' } as User);
      consentRepository.save.mockResolvedValue({ id: '1' } as ConsentEvent);
      await service.processConsentEvent(mockConsentEventDto);
      expect(consentRepository.save).toHaveBeenCalledWith(mockConsentEventDto);
      expect(eventBus.publish).toHaveBeenCalledWith(
        ConsentEvents.ConsentChanged,
        mockConsentEventDto,
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(
        service.processConsentEvent(mockConsentEventDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('publishConsentEvent', () => {
    it('should publish consent event', () => {
      service.publishConsentEvent(mockConsentEventDto);
      expect(eventBus.publish).toHaveBeenCalledWith(
        ConsentEvents.ConsentChanged,
        mockConsentEventDto,
      );
    });
  });

  describe('createUser', () => {
    it('should restore a soft-deleted user if exists', async () => {
      const createUserDto: CreateUserDto = {
        userId: '1',
        email: 'test@example.com',
      };
      userRepository.findOne.mockResolvedValue({
        id: '1',
        deletedAt: new Date(),
      } as User);
      await service.createUser(createUserDto);
      expect(userRepository.update).toHaveBeenCalledWith('1', {
        deletedAt: null,
        id: createUserDto.userId,
      });
    });
  });

  describe('softDeleteUser', () => {
    it('should throw an error if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.softDeleteUser('1')).rejects.toThrow(
        'User not found',
      );
    });
  });
});
