// import { Prisma } from '@prisma/client';

// export interface IEvent<T extends Prisma.EventDefaultArgs>
//   extends Prisma.EventGetPayload<T> {}

import { Prisma } from '@prisma/client';

export type IEvent<T extends Prisma.EventDefaultArgs> =
  Prisma.EventGetPayload<T>;
