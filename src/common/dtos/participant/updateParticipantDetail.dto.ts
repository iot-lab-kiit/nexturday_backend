import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateParticipantDetailDto {
  @IsNotEmpty()
  @IsString()
  branch: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/)
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/)
  @MinLength(10)
  @MaxLength(10)
  whatsappNumber: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  studyYear: number;
}
