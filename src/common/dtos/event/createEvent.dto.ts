import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EventDetailDto } from './eventdetail.dto';
import 'reflect-metadata';

export class CreateEventDto {
  societyId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  emails: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  guidlines: string[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  phoneNumbers: string[];

  @ValidateIf((o) => o.paid == true)
  @IsNotEmpty()
  @IsString()
  registrationUrl?: string;

  @ValidateIf((o) => o.paid === true)
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  price?: number;

  @IsNotEmpty()
  @IsDateString()
  from: Date;

  @IsNotEmpty()
  @IsDateString()
  to: Date;

  @IsNotEmpty()
  @IsBoolean()
  paid: boolean;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EventDetailDto)
  details: EventDetailDto[];

  constructor(payload?: CreateEventDto) {
    if (!payload?.paid) {
      delete payload?.registrationUrl;
      delete payload?.price;
    }
    const details = payload?.details.map(
      (detail) => new EventDetailDto(detail),
    ) as EventDetailDto[];
    payload = { ...payload, details } as CreateEventDto;
    Object.assign(this, payload);
  }
}
