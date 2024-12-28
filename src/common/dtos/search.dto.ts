import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotIn,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @IsString()
  @IsNotIn(['password'])
  field: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  direction: 'desc' | 'asc';

  constructor(payload?: SearchDto) {
    const page = payload?.page ? payload?.page : 1;
    const field = payload?.field ? payload?.field : 'createdAt';
    const direction = payload?.direction ? payload?.direction : 'desc';

    Object.assign(this, { ...payload, page, field, direction });
  }
}
