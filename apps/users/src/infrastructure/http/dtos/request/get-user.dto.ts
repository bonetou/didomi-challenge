import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
