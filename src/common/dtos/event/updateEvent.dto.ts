import { IsArray, IsOptional, IsString } from 'class-validator';
import { EventDto } from './event.dto';

export class UpdateEventDto extends EventDto {
  eventId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagesKeys?: string[];

  constructor(payload: UpdateEventDto) {
    super({ ...payload });
  }
}
