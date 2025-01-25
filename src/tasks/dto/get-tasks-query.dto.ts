import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'libs/common/dto/pagination.dto';

export class CreatedAt {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class TaskQueryDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  priority?: string[];

  @IsOptional()
  @IsArray()
  status?: string[];

  @IsOptional()
  @IsString({ each: true })
  projectId?: string[];

  @IsOptional()
  @IsString({ each: true })
  createdById?: string[];

  @IsOptional()
  @IsString()
  assignedToId?: string[];

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
  accessLevel?: boolean;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsObject()
  createdAt?: CreatedAt;
}
