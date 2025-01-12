import { Prisma } from '@prisma/client';

export interface ISociety
  extends Prisma.SocietyGetPayload<{
    omit: {
      password: true;
    };
  }> {}
