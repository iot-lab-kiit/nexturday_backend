import { PrismaClient } from '@prisma/client';
import {
  IAllEvents,
  IEventParticipant,
  IPaginatedData,
  IResponse,
} from '../../../interfaces';
import { CreateEventDto, SearchDto } from '../../../common/dtos';
import { TAKE_PAGES } from '../../../common/constants';

export class SocietyService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createEvent(dto: CreateEventDto): Promise<IResponse> {
    const {
      emails,
      from,
      guidlines,
      name,
      paid,
      phoneNumbers,
      price,
      societyId,
      to,
      registrationUrl,
      websiteUrl,
      about,
      details,
    } = dto;

    await this.prisma.event.create({
      data: {
        about,
        from,
        name,
        paid,
        to,
        emails,
        guidlines,
        websiteUrl,
        societyId,
        phoneNumbers,
        price,
        registrationUrl,
        details: {
          create: details.map((detail) => ({
            name: detail.name,
            about: detail.about,
            from: detail.from,
            to: detail.to,
            type: detail.type,
            venue: {
              create: {
                mapUrl: detail.venue?.mapUrl,
                name: detail.venue?.name,
              },
            },
          })),
        },
      },
    });

    return {
      success: true,
      message: 'event created successfully',
    };
  }

  async deleteEvent(eventId: string): Promise<IResponse> {
    await this.prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    return {
      success: true,
      message: 'event deleted successfully',
    };
  }

  async myEvents(
    societyId: string,
    dto: SearchDto,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalMyEvents = await this.prisma.event.count({
      where: {
        societyId,
      },
    });
    const totalPages = Math.ceil(totalMyEvents / TAKE_PAGES);
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
        societyId,
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
      message: 'events fetched successfully',
      data: {
        currentPage: dto.page,
        nextPage,
        totalItems: totalMyEvents,
        totalPages,
        data: events,
      },
    };
  }

  async getAllParticipants(
    eventId: string,
    dto: SearchDto,
  ): Promise<IResponse<IPaginatedData<IEventParticipant>>> {
    const totalParticipants = await this.prisma.eventParticipant.count({
      where: {
        eventId,
      },
    });
    const totalPages = Math.ceil(totalParticipants / TAKE_PAGES);
    const nextPage = totalPages > dto.page ? dto.page + 1 : null;
    const participants = await this.prisma.eventParticipant.findMany({
      skip: (dto.page - 1) * TAKE_PAGES,
      take: TAKE_PAGES,
      orderBy: dto.q
        ? [
            {
              participant: {
                _relevance: {
                  fields: ['name', 'email', 'rollNo'],
                  search: dto.q,
                  sort: 'desc',
                },
              },
            },
            { [dto.field]: dto.direction },
          ]
        : [{ [dto.field]: dto.direction }],
      where: {
        eventId,
        participant: dto.q
          ? {
              OR: [
                { name: { search: dto.q } },
                { email: { search: dto.q } },
                { rollNo: { search: dto.q } },
              ],
            }
          : undefined,
      },
      include: {
        participant: true,
      },
    });

    return {
      success: true,
      message: 'participants fetched successfully',
      data: {
        currentPage: dto.page,
        nextPage,
        totalItems: totalParticipants,
        totalPages,
        data: participants,
      },
    };
  }
}
