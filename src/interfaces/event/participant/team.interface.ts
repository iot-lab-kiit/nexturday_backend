import { Prisma } from '@prisma/client';

export interface ITeam
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
