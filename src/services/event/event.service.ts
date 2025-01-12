import { PrismaClient } from '@prisma/client';
import {
  IAllEvents,
  IEvent,
  IEventById,
  IPaginatedData,
  IResponse,
} from '../../interfaces';
import { TAKE_PAGES } from '../../common/constants';
import { CreateEventDto, SearchDto } from '../../common/dtos';
import { UploaderService } from '../uploader';
import { CustomError } from '../../utils';

export class EventService {
  private prisma: PrismaClient;
  private uploaderService: UploaderService;

  constructor() {
    this.prisma = new PrismaClient();
    this.uploaderService = new UploaderService();
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
        images: true,
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
        images: true,
      },
    });

    return {
      success: true,
      message: 'events fetched successfully',
      data: event,
    };
  }

  async createEvent(
    dto: CreateEventDto,
    images?: Express.Multer.File[],
  ): Promise<IResponse> {
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
    if (!images || images.length === 0) {
      throw new CustomError('images are required', 400);
    }
    const imagesData = await this.uploaderService.uploadMultiple(images);

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
        images: {
          create: imagesData.map((imageData) => ({
            url: imageData.url,
            key: imageData.key,
          })),
        },
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
    const event = (await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        images: true,
      },
    })) as IEvent<{ include: { images: true } }>;
    await this.uploaderService.deleteMultiple(event.images);

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
}
