import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UserResponseDto } from '../dtos/response/user-response.dto';
import { UserWithEmailAlreadyExistsError } from '../../../application/errors/user-with-email-already-exists.error';
import { UserDTOMapper } from '../mappers/user.mapper';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

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
}
