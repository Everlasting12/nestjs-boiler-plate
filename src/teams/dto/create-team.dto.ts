import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  teamLeadId: string;

  createdById?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
