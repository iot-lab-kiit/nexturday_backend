import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class VenueDto {
  @IsNotEmpty()
  @IsUrl()
  mapUrl: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
