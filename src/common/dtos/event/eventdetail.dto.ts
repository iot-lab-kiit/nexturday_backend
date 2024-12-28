import { EventType } from '@prisma/client';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VenueDto } from './venue.dto';
import { Type } from 'class-transformer';
import 'reflect-metadata';

export class EventDetailDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  about: string;

  @IsNotEmpty()
  @IsDateString()
  from: Date;

  @IsNotEmpty()
  @IsDateString()
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
