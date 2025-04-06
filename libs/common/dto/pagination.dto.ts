import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class PaginationDto {
  @ValidateIf(
    (object: any) => object.skip !== undefined || object.limit !== undefined,
  )
  @IsBoolean()
  @Transform((field: TransformFnParams) => {
    return field.value === 'true';
  })
  paginate?: boolean;

  @ValidateIf(
    (object: any) =>
      object.paginate === true ||
      (object.skip !== undefined && object.limit !== undefined),
  )
  @IsNumber({}, { message: "'skip' should be a number (skip >= 0)" })
  @Type(() => Number)
  skip?: number;

  @ValidateIf(
    (object: any) =>
      object.paginate === true ||
      (object.skip !== undefined && object.limit !== undefined),
  )
  @IsNumber({}, { message: "'limit' should be a number (limit >= 0)" })
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString({ each: true })
  select?: string[];
}
