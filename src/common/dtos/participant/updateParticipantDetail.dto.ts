import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsCountryCode } from '../../decorators';

export class UpdateParticipantDetailDto {
  participantId: string;

  @IsNotEmpty()
  @IsString()
  branch: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsCountryCode()
  countryCode: string;

  @IsNotEmpty()
  @IsString()
  @IsCountryCode()
  countryCodeWhatsapp: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/)
  @MinLength(9)
  @MaxLength(15)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/)
  @MinLength(9)
  @MaxLength(15)
  whatsappNumber: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  studyYear: number;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;
}
