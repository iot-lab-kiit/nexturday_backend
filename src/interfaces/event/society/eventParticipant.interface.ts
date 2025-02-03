import { Prisma } from '@prisma/client';

export interface IEventParticipant
  extends Prisma.TeamGetPayload<{
    include: {
      leader: {
        include: {
          detail: true;
        };
      };
      members: {
        include: {
          participant: {
            include: {
              detail: true;
            };
          };
        };
      };
    };
  }> {}
