import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
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
  @IsString()
  assignedToId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsDateString()
  dueDate: string;

  createdById?: string;
  projectId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
