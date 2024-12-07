import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'libs/common/dto/pagination.dto';

export class TaskQueryDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  priority?: string[];

  @IsOptional()
  @IsArray()
  status?: string[];

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  relation?: boolean;
}
