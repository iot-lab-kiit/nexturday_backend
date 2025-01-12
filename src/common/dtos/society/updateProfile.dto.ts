import { IsOptional, IsString } from 'class-validator';

export class UpdateSocietyDto {
  societyId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;
}
