import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'libs/common/dto/pagination.dto';

export class UserRoleQueryDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  roleId?: string[];

  @IsOptional()
  @IsArray()
  userId?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  relation?: boolean;
}
