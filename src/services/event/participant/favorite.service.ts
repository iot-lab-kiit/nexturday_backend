import { PrismaClient } from '@prisma/client';
import { IAllEvents, IPaginatedData, IResponse } from '../../../interfaces';
import { SearchDto } from '../../../common/dtos';
import { TAKE_PAGES } from '../../../common/constants';

export class FavoriteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async favoriteEvent(uid: string, eventId: string): Promise<IResponse> {
    await this.prisma.favoriteEvent.create({
      data: {
        eventId,
        participantId: uid,
      },
    });

    return {
      success: true,
      message: 'event favorite successfully',
    };
  }

  async unfavoriteEvent(uid: string, eventId: string): Promise<IResponse> {
    await this.prisma.favoriteEvent.delete({
      where: {
        participantId_eventId: {
          eventId,
          participantId: uid,
        },
      },
    });

    return {
      success: true,
      message: 'event unfavorite successfully',
    };
  }

  async getAllFavoriteEvents(
    uid: string,
    dto: SearchDto,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalFavoriteEvents = await this.prisma.eventParticipant.count({
      where: {
        participantId: uid,
      },
    });
    const totalPages = Math.ceil(totalFavoriteEvents / TAKE_PAGES);
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
        favoriteBy: {
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
      message: 'favorite events fetched successfully',
      data: {
        currentPage: dto.page,
        nextPage,
        totalItems: totalFavoriteEvents,
        totalPages,
        data: events,
      },
    };
  }
}