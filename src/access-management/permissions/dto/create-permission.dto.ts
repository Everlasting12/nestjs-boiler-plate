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

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  apiScopes: string[];

  @IsArray()
  @IsString({ each: true })
  feScopes: string[];

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

export class CreateBulkPermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  data: CreatePermissionDto[];
}
