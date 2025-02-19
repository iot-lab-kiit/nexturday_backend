import { IsOptional, IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsOptional()
  @IsString()
  fcmToken?: string;
}
