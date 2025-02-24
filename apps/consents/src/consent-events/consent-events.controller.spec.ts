import { Test, TestingModule } from '@nestjs/testing';
import { ConsentEventsService } from './consent-events.service';
import { CreateConsentEventDto } from './dto/create-consent-event.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ConsentId } from './enums/consent-ids.enum';
import { ConsentsController } from './consent-events.controller';

describe('ConsentsController', () => {
  let controller: ConsentsController;
  let service: jest.Mocked<ConsentEventsService>;

  const mockConsentEventDto: CreateConsentEventDto = {
    userId: '00000000-0000-0000-0000-000000000000',
    consentId: ConsentId.EMAIL_NOTIFICATIONS,
    enabled: true,
  };

  const mockCreateUserDto: CreateUserDto = {
    userId: '00000000-0000-0000-0000-000000000000',
    email: 'test@example.com',
  };

  const mockDeleteUserDto: DeleteUserDto = {
    userId: '00000000-0000-0000-0000-000000000000',
  };

  beforeEach(async () => {
    const serviceMock: Partial<ConsentEventsService> = {
      processConsentEvent: jest.fn(),
      createUser: jest.fn(),
      softDeleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentsController],
      providers: [{ provide: ConsentEventsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ConsentsController>(ConsentsController);
    service = module.get(ConsentEventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processConsentEvent', () => {
    it('should call service method processConsentEvent with correct params', async () => {
      await controller.processConsentEvent(mockConsentEventDto);
      expect(service.processConsentEvent).toHaveBeenCalledWith(
        mockConsentEventDto,
      );
    });
  });

  describe('handleUserCreated', () => {
    it('should call service method createUser with correct params', async () => {
      await controller.handleUserCreated(mockCreateUserDto);
      expect(service.createUser).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('handleUserDeleted', () => {
    it('should call service method softDeleteUser with correct params', async () => {
      await controller.handleUserDeleted(mockDeleteUserDto);
      expect(service.softDeleteUser).toHaveBeenCalledWith(
        mockDeleteUserDto.userId,
      );
    });
  });
});
