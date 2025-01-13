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

  async joinEvent(participantId: string, eventId: string): Promise<IResponse> {
    const participantDetail = await this.prisma.participantDetail.findUnique({
      where: {
        participantId,
      },
    });
    if (!participantDetail) {
      throw new CustomError('participant details not found', 404);
    }
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      throw new CustomError('event not found', 404);
    }
    if ((event?.to as Date).getTime() < Date.now()) {
      throw new CustomError('event finished', 400);
    }
    if (event?.paid === true) {
      throw new CustomError('paid event', 400);
    }
    await this.prisma.eventParticipant.create({
      data: {
        eventId,
        participantId,
      },
    });

    await this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        participationCount: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      message: 'event joined successfully',
    };
  }

  async getAllJoinedEvents(
    participantId: string,
    dto: SearchDto,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalJoinedEvents = await this.prisma.eventParticipant.count({
      where: {
        participantId,
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
            participantId,
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
