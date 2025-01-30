import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  projectId?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  priority?: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  projectCode: string;

  @IsString()
  clientName: string;

  @IsOptional()
  @IsString()
  companyName: string;

  @IsString()
  location: string;

  @IsString()
  teamLeadId: string;

  @IsOptional()
  @IsString()
  clientEmailId?: string;

  createdById?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNotEmpty()
  @IsString()
  constructionArea: string;
}
