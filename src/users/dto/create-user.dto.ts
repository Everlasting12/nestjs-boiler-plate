import {
  IsDateString,
  IsEmail,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  id?: number;
  userId?: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  profilePic?: string;

  @IsDateString()
  lastLogin?: Date;

  createdAt?: Date;
  isActive?: boolean;
  updatedAt?: Date;
}
