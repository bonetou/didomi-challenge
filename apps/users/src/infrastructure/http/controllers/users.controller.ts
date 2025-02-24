import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
  Delete,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import {
  CreateUserDto,
  DeleteUserDto,
  GetUserDto,
} from '../dtos/request/user.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserWithEmailAlreadyExistsError } from '../../../application/errors/user-with-email-already-exists.error';
import { UserDTOMapper } from '../mappers/user.mapper';
import { GetUserUseCase } from '../../../application/use-cases/get-user.use-case';
import { UserDoesNotExistError } from '../../../application/errors/user-does-not-exist.error';
import { DeleteUserUseCase } from '../../../application/use-cases/delete-user.use-case';
import { GlobalApiResponses } from '@app/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@GlobalApiResponses()
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.createUserUseCase.execute(createUserDto.email);
      return UserDTOMapper.toResponse(user);
    } catch (error) {
      if (error instanceof UserWithEmailAlreadyExistsError) {
        throw new UnprocessableEntityException(error.message);
      }
      throw error;
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  async getUserByEmail(
    @Query() getUserDto: GetUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.getUserUseCase.execute(getUserDto.email);
      return UserDTOMapper.toResponse(user);
    } catch (error) {
      if (error instanceof UserDoesNotExistError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Delete a user by email' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUserByEmail(
    @Query() deleteUserDto: DeleteUserDto,
  ): Promise<void> {
    await this.deleteUserUseCase.execute(deleteUserDto.email);
  }
}
