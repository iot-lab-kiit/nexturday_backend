import { EventType } from '@prisma/client';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VenueDto } from './venue.dto';
import { Transform, Type } from 'class-transformer';
import 'reflect-metadata';
import { IsAfter, IsNotPast } from '../../decorators';

export class EventDetailDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  about: string;

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
  @IsIn(Object.keys(EventType))
  type: EventType;

  @ValidateIf((o) => o.type === 'OFFLINE')
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => VenueDto)
  venue?: VenueDto;

  constructor(payload?: EventDetailDto) {
    if (payload?.type === 'ONLINE') {
      delete payload?.venue;
    }
    Object.assign(this, payload);
  }
}
