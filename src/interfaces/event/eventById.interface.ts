import { IEvent } from './event.type';
import { PaymentStatus } from '@prisma/client';

export interface IEventById
  extends IEvent<{
    include: {
      society: {
        omit: {
          password: true;
        };
      };
      details: {
        include: {
          venue: true;
        };
      };
      images: {
        select: {
          url: true;
          key: true;
        };
      };
    };
  }> {
  joined?: boolean;
  isFavorite?: boolean;
  isLeader?: boolean;
  paymentStatus?: PaymentStatus;
}
