import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateUserRoleDto {
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsObject()
  permissionEntities: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateBulkUserRolesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserRoleDto)
  data: CreateUserRoleDto[];
}
