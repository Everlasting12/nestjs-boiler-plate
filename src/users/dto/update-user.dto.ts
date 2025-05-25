import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  roleId?: string;
}
