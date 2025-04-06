import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class PaymentStatusUpdateDto {
  @IsNotEmpty()
  @IsString()
  teamId: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => PaymentStatus[value.toUpperCase() as keyof typeof PaymentStatus])
  paymentStatus: PaymentStatus;
}