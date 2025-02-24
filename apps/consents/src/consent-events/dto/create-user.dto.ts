import { IsEmail, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  userId: string;

  @IsEmail()
  email: string;
}
