import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'libs/common/dto/pagination.dto';

export class ProjectQueryDto extends PaginationDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  status?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  relation?: boolean;
}
