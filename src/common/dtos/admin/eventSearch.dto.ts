import { IsBoolean, IsOptional } from 'class-validator';
import { SearchDto } from '../search.dto';
import { Transform } from 'class-transformer';

export class EventSearchDto extends SearchDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value === 'true') return true;
      else return false;
    } else return value;
  })
  @IsBoolean()
  isApproved?: boolean;

  constructor(payload: EventSearchDto) {
    super(payload);
    let isApproved: boolean | undefined;
    if (payload?.isApproved) {
      isApproved =
        (payload?.isApproved as unknown as string).toLowerCase() === 'true'
          ? true
          : false;
    }
    payload = { ...payload, isApproved } as EventSearchDto;
    Object.assign(this, payload);
  }
}
