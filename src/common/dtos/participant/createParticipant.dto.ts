import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateParticipantDto {
  uid: string;
  rollNo: string;
  name: string;
  email: string;
  imageUrl?: string;

  @IsNotEmpty()
  @IsString()
  branch: string;

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
  @Min(1)
  @Max(4)
  studyYear: number;
}
