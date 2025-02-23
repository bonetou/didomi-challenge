import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserEmailDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class CreateUserDto extends UserEmailDto {}
export class GetUserDto extends UserEmailDto {}
export class DeleteUserDto extends UserEmailDto {}
