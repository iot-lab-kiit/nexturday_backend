import { Prisma } from '@prisma/client';

export interface IParticipant
  extends Prisma.ParticipantGetPayload<{
    include: {
      detail: true;
    };
  }> {}
