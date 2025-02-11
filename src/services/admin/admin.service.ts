import { PrismaClient } from '@prisma/client';
import { IAllEvents, IPaginatedData, IResponse } from '../../interfaces';
import { TAKE_PAGES } from '../../common/constants';
import { EventSearchDto } from '../../common/dtos';

export class AdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async approveEvent(eventId: string): Promise<IResponse> {
    await this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        isApproved: true,
      },
    });

    return {
      success: true,
      message: 'event approved successfully',
    };
  }

  async rejectEvent(eventId: string): Promise<IResponse> {
    await this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        isApproved: false,
      },
    });

    return {
      success: true,
      message: 'event rejected successfully',
    };
  }

  async getAllEvents(
    dto: EventSearchDto,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalEvents = await this.prisma.event.count({
      where:
        dto.isApproved !== undefined
          ? {
              isApproved: dto.isApproved,
            }
          : undefined,
    });
    const totalPages = Math.ceil(totalEvents / TAKE_PAGES);
    const nextPage = totalPages > dto.page ? dto.page + 1 : null;
    const events = await this.prisma.event.findMany({
      skip: (dto.page - 1) * TAKE_PAGES,
      take: TAKE_PAGES,
      orderBy: dto.q
        ? [
            {
              _relevance: {
                fields: ['name', 'about', 'tags'],
                search: dto.q,
                sort: 'desc',
              },
            },
            { [dto.field]: dto.direction },
          ]
        : [{ [dto.field]: dto.direction }],

      where: {
        AND: [
          dto.q
            ? {
                OR: [
                  { name: { search: dto.q } },
                  { about: { search: dto.q } },
                  { tags: { has: dto.q } },
                  { society: { name: { search: dto.q } } },
                ],
              }
            : {},
          dto.isApproved !== undefined
            ? {
                isApproved: dto.isApproved,
              }
            : {},
        ],
      },
      include: {
        society: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            key: true,
            url: true,
          },
        },
        details: {
          select: {
            venue: true,
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
}
