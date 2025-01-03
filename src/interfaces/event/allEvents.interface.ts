import { IEvent } from './event.type';

export interface IAllEvents
  extends IEvent<{
    include: {
      society: {
        select: {
          name: true;
        };
      };
    };
  }> {}
