import { PrismaClient } from '@prisma/client';
import { IAllEvents, IPaginatedData, IResponse } from '../../../interfaces';
import { CustomError } from '../../../utils';
import { TAKE_PAGES } from '../../../common/constants';
import { SearchDto } from '../../../common/dtos';

export class ParticipantService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async joinEvent(uid: string, eventId: string): Promise<IResponse> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if ((event?.from as Date).getTime() < Date.now()) {
      throw new CustomError('event finished', 400);
    }
    if (event?.paid === true) {
      throw new CustomError('paid event', 400);
    }
    await this.prisma.eventParticipant.create({
      data: {
        eventId,
        participantId: uid,
      },
    });

    return {
      success: true,
      message: 'event joined successfully',
    };
  }

  async getAllJoinedEvents(
    uid: string,
    dto: SearchDto,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalJoinedEvents = await this.prisma.eventParticipant.count({
      where: {
        participantId: uid,
      },
    });
    const totalPages = Math.ceil(totalJoinedEvents / TAKE_PAGES);
    const nextPage = totalPages > dto.page ? dto.page + 1 : null;
    const events = await this.prisma.event.findMany({
      skip: (dto.page - 1) * TAKE_PAGES,
      take: TAKE_PAGES,
      orderBy: dto.q
        ? [
            {
              _relevance: {
                fields: ['name', 'about'],
                search: dto.q,
                sort: 'desc',
              },
            },
            { [dto.field]: dto.direction },
          ]
        : [{ [dto.field]: dto.direction }],
      where: {
        participants: {
          some: {
            participantId: uid,
          },
        },
        ...(dto.q
          ? {
              OR: [
                { name: { search: dto.q } },
                { about: { search: dto.q } },
                { society: { name: { search: dto.q } } },
              ],
            }
          : undefined),
      },
      include: {
        society: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'joined events fetched successfully',
      data: {
        currentPage: dto.page,
        nextPage,
        totalItems: totalJoinedEvents,
        totalPages,
        data: events,
      },
    };
  }
}
