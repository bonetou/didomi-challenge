import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
