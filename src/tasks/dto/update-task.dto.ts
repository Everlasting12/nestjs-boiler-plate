import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

export enum TaskEvents {
  'COMMENT' = 'COMMENT',
  'STATUS_CHANGE' = 'STATUS_CHANGE',
}

export class Details {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  text?: string;
}

export class Action {
  id?: string;
  createdAt?: Date;

  @IsString()
  @IsEnum(TaskEvents)
  eventType: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Details)
  details: Details;
}
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Action)
  action?: Action;

  history?: Prisma.JsonValue;
}
