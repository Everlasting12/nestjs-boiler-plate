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

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];

  @IsObject()
  permissionEntities: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateBulkRolesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  data: CreateRoleDto[];
}
