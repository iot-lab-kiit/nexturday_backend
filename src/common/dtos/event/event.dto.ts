import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EventDetailDto } from './eventdetail.dto';
import 'reflect-metadata';
import { IsAfter, IsBefore, IsNotPast, IsWithinRange } from '../../decorators';

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

  @IsOptional()
  // @IsUrl()
  paymentQr?: string;

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
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsBefore('to')
  deadline: Date;

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value === 'true') return true;
      else return false;
    } else return value;
  })
  @IsBoolean()
  paid: boolean;

  @IsNotEmpty()
  @Transform(({ value }) => {
    console.log('value', value);
    if (typeof value === 'string') {
      return value.split(',').map((tag: string) => tag.trim());
    }
    return value;
  })
  tags: string[];

  @IsOptional()
  @IsUrl()
  transcript?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EventDetailDto)
  @IsWithinRange({ from: 'from', to: 'to' })
  details: EventDetailDto[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  maxTeamSize?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value === 'true') return true;
      else return false;
    } else return value;
  })
  @IsBoolean()
  isOutsideParticipantAllowed?: boolean;

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
      payload.isOutsideParticipantAllowed &&
      (
        payload?.isOutsideParticipantAllowed as unknown as string
      ).toLowerCase() === 'true'
        ? true
        : false;
      if (!paid) {
        delete payload?.registrationUrl;
        delete payload?.price;
      }
      payload = { ...payload, details, paid } as EventDto;
    }
    if (payload?.paymentQr) {
      this.paymentQr = payload.paymentQr;
    }
    Object.assign(this, payload);
  }
}
