import { IEvent } from './event.type';

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
      _count: {
        select: {
          participants: true;
        };
      };
    };
  }> {}
