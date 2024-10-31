import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
