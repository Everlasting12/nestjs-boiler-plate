import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'libs/common/dto/pagination.dto';

export class UserQueryDto extends PaginationDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString({ each: true })
  userIds?: string[];

  @IsOptional()
  email?: string;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  relation?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  unassingedUsers?: boolean;
}
