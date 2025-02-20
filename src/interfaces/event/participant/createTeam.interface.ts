import { Prisma } from '@prisma/client';

export interface ICreateTeam extends Prisma.TeamGetPayload<{}> {}
