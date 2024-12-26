import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateParticipantDto {
  @IsOptional()
  @IsString()
  branch: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/)
  @MinLength(10)
  @MaxLength(10)
  whatsappNumber: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  studyYear: number;
}
