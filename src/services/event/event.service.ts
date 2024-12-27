import { PrismaClient } from '@prisma/client';
import {
  IAllEvents,
  IEventById,
  IPaginatedData,
  IResponse,
} from '../../interfaces';
import { TAKE_PAGES } from '../../common/constants';
import { SearchDto } from '../../common/dtos';

export class EventService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllEvents(
    dto: SearchDto,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalEvents = await this.prisma.event.count();
    const totalPages = Math.ceil(totalEvents / TAKE_PAGES);
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

      where: dto.q
        ? {
            OR: [
              { name: { search: dto.q } },
              { about: { search: dto.q } },
              { society: { name: { search: dto.q } } },
            ],
          }
        : undefined,
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
      message: 'events fetched successfully',
      data: {
        currentPage: dto.page,
        nextPage,
        totalItems: totalEvents,
        totalPages,
        data: events,
      },
    };
  }

  async getEventById(eventId: string): Promise<IResponse<IEventById>> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        society: {
          omit: {
            password: true,
          },
        },
        details: {
          include: {
            venue: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'events fetched successfully',
      data: event,
    };
  }
}
