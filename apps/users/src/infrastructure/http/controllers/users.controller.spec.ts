import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../../application/use-cases/get-user.use-case';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { UserWithEmailAlreadyExistsError } from '../../../application/errors/user-with-email-already-exists.error';
import { UserDoesNotExistError } from '../../../application/errors/user-does-not-exist.error';
import {
  CreateUserDto,
  GetUserDto,
  DeleteUserDto,
} from '../dtos/request/user.dto';
import {
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserController } from './users.controller';
import { UserAggregate } from '../../../domain/aggregates/user.aggregate';
import { UserFactory } from '../../../domain/factories/user.factory';
import { UserResponseDto } from '../dtos/response/user-response.dto';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let getUserUseCase: jest.Mocked<GetUserUseCase>;
  let deleteUserUseCase: jest.Mocked<DeleteUserUseCase>;

  const mockUseCaseResponse: UserAggregate =
    UserFactory.create('test@example.com');

  const expectedResponse: UserResponseDto = {
    id: mockUseCaseResponse.user.id,
    email: mockUseCaseResponse.user.email,
    consents: [],
  };

  beforeEach(async () => {
    const createUserMock: Partial<CreateUserUseCase> = {
      execute: jest.fn().mockResolvedValue(mockUseCaseResponse),
    };
    const getUserMock: Partial<GetUserUseCase> = {
      execute: jest.fn().mockResolvedValue(mockUseCaseResponse),
    };
    const deleteUserMock: Partial<DeleteUserUseCase> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: CreateUserUseCase, useValue: createUserMock },
        { provide: GetUserUseCase, useValue: getUserMock },
        { provide: DeleteUserUseCase, useValue: deleteUserMock },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get(CreateUserUseCase);
    getUserUseCase = module.get(GetUserUseCase);
    deleteUserUseCase = module.get(DeleteUserUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should return user response when user is created', async () => {
      const dto: CreateUserDto = { email: mockUseCaseResponse.user.email };
      const result = await controller.createUser(dto);

      expect(result).toEqual(expectedResponse);
      expect(createUserUseCase.execute).toHaveBeenCalledWith(dto.email);
    });

    it('should throw Unprocessable Entity if user already exists', async () => {
      createUserUseCase.execute.mockRejectedValue(
        new UserWithEmailAlreadyExistsError(mockUseCaseResponse.user.email),
      );
      const dto: CreateUserDto = { email: mockUseCaseResponse.user.email };
      await expect(controller.createUser(dto)).rejects.toThrow(
        UnprocessableEntityException,
      );

      await expect(controller.createUser(dto)).rejects.toMatchObject({
        response: {
          message: `User with email ${mockUseCaseResponse.user.email} already exists`,
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should return user response when user exists', async () => {
      const dto: GetUserDto = { email: mockUseCaseResponse.user.email };
      const result = await controller.getUserByEmail(dto);

      expect(result).toEqual(expectedResponse);
      expect(getUserUseCase.execute).toHaveBeenCalledWith(dto.email);
    });

    it('should throw NotFound if user does not exist', async () => {
      getUserUseCase.execute.mockRejectedValue(
        new UserDoesNotExistError(mockUseCaseResponse.user.email),
      );
      const dto: GetUserDto = { email: mockUseCaseResponse.user.email };
      await expect(controller.getUserByEmail(dto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.getUserByEmail(dto)).rejects.toMatchObject({
        response: {
          message: `User ${mockUseCaseResponse.user.email} does not exist`,
        },
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('deleteUserByEmail', () => {
    it('should call deleteUserUseCase.execute with correct email', async () => {
      const dto: DeleteUserDto = { email: mockUseCaseResponse.user.email };
      await controller.deleteUserByEmail(dto);
      expect(deleteUserUseCase.execute).toHaveBeenCalledWith(dto.email);
    });
  });
});
