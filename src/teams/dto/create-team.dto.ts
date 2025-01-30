import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  teamLeadId: string;

  @IsOptional()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  assistantTeamLeadIds?: string[];

  createdById?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
