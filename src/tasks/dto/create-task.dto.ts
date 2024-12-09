import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  drawingTitle: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  priority: string;

  @IsNotEmpty()
  @IsNumber()
  dueTime: number;

  @IsNotEmpty()
  @IsString()
  assignedToId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  createdById?: string;
  projectId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
