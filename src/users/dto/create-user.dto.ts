import {
  IsDateString,
  IsEmail,
  IsOptional,
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

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsDateString()
  lastLogin?: Date;

  createdAt?: Date;
  isActive?: boolean;
  updatedAt?: Date;
}
