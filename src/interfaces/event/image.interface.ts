import { Prisma } from '@prisma/client';

export interface IImage extends Prisma.ImageGetPayload<{}> {}
