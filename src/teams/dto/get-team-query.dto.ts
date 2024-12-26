import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'libs/common/dto/pagination.dto';

export class TeamQueryDto extends PaginationDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  projectId?: string;

  @IsOptional()
  teamLeadId?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((field: TransformFnParams) => field.value === 'true')
  relation?: boolean;
}
