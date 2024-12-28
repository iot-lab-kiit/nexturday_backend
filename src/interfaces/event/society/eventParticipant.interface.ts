import { Prisma } from '@prisma/client';

export interface IEventParticipant
  extends Prisma.EventParticipantGetPayload<{
    include: {
      participant: true;
    };
  }> {}
