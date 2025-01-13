import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
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
import { IsAfter, IsNotPast } from '../../decorators';

export class EventDto {
  societyId?: string;

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
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotPast()
  from: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsAfter('from')
  to: Date;

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    else return false;
  })
  @IsBoolean()
  paid: boolean;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EventDetailDto)
  details: EventDetailDto[];

  constructor(payload?: EventDto) {
    if (payload?.details) {
      const details = JSON.parse(payload.details as unknown as string).map(
        (detail: EventDetailDto) => {
          return new EventDetailDto(detail);
        },
      ) as EventDetailDto[];
      const paid =
        (payload?.paid as unknown as string).toLowerCase() === 'true'
          ? true
          : false;
      if (paid) {
        delete payload?.registrationUrl;
        delete payload?.price;
      }
      payload = { ...payload, details, paid } as EventDto;
    }
    Object.assign(this, payload);
  }
}
