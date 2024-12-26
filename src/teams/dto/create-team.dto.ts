import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  members: string[];

  @IsString()
  @IsNotEmpty()
  teamLeadId: string;

  // @IsNotEmpty()
  // @IsString()
  // projectId: string;

  createdById?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
