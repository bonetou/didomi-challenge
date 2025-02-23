import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserWithEmailAlreadyExistsError } from '../../../application/errors/user-with-email-already-exists.error';
import { UserDTOMapper } from '../mappers/user.mapper';
import { GetUserDto } from '../dtos/request/get-user.dto';
import { GetUserUseCase } from 'apps/users/src/application/use-cases/get-user.use-case';
import { UserDoesNotExistError } from 'apps/users/src/application/errors/user-does-not-exist.error';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.createUserUseCase.execute(createUserDto.email);
      return UserDTOMapper.toResponse(user);
    } catch (error) {
      if (error instanceof UserWithEmailAlreadyExistsError) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw error;
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserByEmail(
    @Query() getUserDto: GetUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.getUserUseCase.execute(getUserDto.email);
      return UserDTOMapper.toResponse(user);
    } catch (error) {
      if (error instanceof UserDoesNotExistError) {
        throw new HttpException(
          { message: error.message },
          HttpStatus.NOT_FOUND,
        );
      }
      throw error;
    }
  }
}
