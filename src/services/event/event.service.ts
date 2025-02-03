import { PrismaClient } from '@prisma/client';
import {
  IAllEvents,
  ICrousel,
  IEvent,
  IEventById,
  IImage,
  IImageData,
  IPaginatedData,
  IResponse,
} from '../../interfaces';
import { CROUSEL, TAKE_PAGES, TOTAL_IMAGES } from '../../common/constants';
import { EventDto, SearchDto, UpdateEventDto } from '../../common/dtos';
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
    role: string,
    isKiitStudent: boolean,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalEvents = await this.prisma.event.count({
      where:
        role === 'PARTICIPANT'
          ? {
              to: {
                gte: new Date(),
              },
            }
          : {},
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
                fields: ['name', 'about'],
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
                  { society: { name: { search: dto.q } } },
                ],
              }
            : {},
          role === 'PARTICIPANT'
            ? {
                to: {
                  gte: new Date(),
                },
              }
            : {},
          isKiitStudent ? {} : { isOutsideParticipantAllowed: true },
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

  async crousel(): Promise<IResponse<ICrousel>> {
    const upcomming = await this.prisma.event.findMany({
      orderBy: {
        from: 'desc',
      },
      take: CROUSEL,
      where: {
        from: {
          gt: new Date(),
        },
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

    const popular = await this.prisma.event.findMany({
      orderBy: {
        teamCount: 'desc',
      },
      take: CROUSEL,
      where: {
        to: {
          gt: new Date(),
        },
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
      message: 'crousel fetched successfully',
      data: {
        popular,
        upcomming,
      },
    };
  }

  async getEventById(
    participantId: string,
    role: string,
    eventId: string,
  ): Promise<IResponse<IEventById>> {
    let joined: boolean | undefined;
    let isFavorite: boolean | undefined;
    if (role === 'PARTICIPANT') {
      const participation = await this.prisma.team.findFirst({
        where: {
          AND: [
            { eventId },
            {
              OR: [
                {
                  leaderId: participantId,
                },
                {
                  members: {
                    some: {
                      participantId,
                    },
                  },
                },
              ],
            },
          ],
        },
      });
      const favorite = await this.prisma.favoriteEvent.findUnique({
        where: {
          participantId_eventId: {
            eventId,
            participantId,
          },
        },
      });
      if (favorite) {
        isFavorite = true;
      } else {
        isFavorite = false;
      }
      if (participation) {
        joined = true;
      } else {
        joined = false;
      }
    }
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
        images: {
          select: {
            url: true,
            key: true,
          },
        },
      },
    });

    if (!event) {
      throw new CustomError('event not found', 404);
    }

    return {
      success: true,
      message: 'events fetched successfully',
      data: { ...(event as IEventById), joined, isFavorite },
    };
  }

  async createEvent(
    dto: EventDto,
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
      deadline,
      isOutsideParticipantAllowed,
      maxTeamSize,
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
        deadline,
        emails,
        guidlines,
        websiteUrl,
        societyId: societyId as string,
        phoneNumbers,
        price,
        registrationUrl,
        images: {
          create: imagesData.map((imageData) => ({
            url: imageData.url,
            key: imageData.key,
          })),
        },
        maxTeamSize,
        isOutsideParticipantAllowed,
        details: {
          create: details.map((detail) => ({
            name: detail.name,
            about: detail.about,
            from: detail.from,
            to: detail.to,
            type: detail.type,
            ...(detail.venue && {
              venue: {
                create: {
                  mapUrl: detail.venue?.mapUrl,
                  name: detail.venue?.name,
                },
              },
            }),
          })),
        },
      },
    });

    return {
      success: true,
      message: 'event created successfully',
    };
  }

  async updateEvent(
    dto: UpdateEventDto,
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
      to,
      registrationUrl,
      websiteUrl,
      about,
      details,
      imagesKeys,
      eventId,
    } = dto;
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        _count: {
          select: {
            images: true,
          },
        },
      },
    });

    let eventImages: IImage[] = [];
    if (imagesKeys && imagesKeys.length > 0) {
      eventImages = await this.prisma.image.findMany({
        where: {
          eventId,
          key: {
            in: imagesKeys,
          },
        },
      });
    }

    let totalImages = event?._count.images as number;
    if (images && images.length !== 0) {
      totalImages += images.length;
    }
    if (eventImages) {
      totalImages -= eventImages.length;
    }
    if (totalImages > TOTAL_IMAGES) {
      throw new CustomError('images limit reached', 400);
    }

    if (totalImages <= 0) {
      throw new CustomError('atleast one image is required', 400);
    }

    if (eventImages && eventImages.length > 0) {
      await this.uploaderService.deleteMultiple(
        eventImages.map((image) => image.key),
      );
    }
    let imagesData: IImageData[] = [];
    if (images && images.length !== 0) {
      imagesData = await this.uploaderService.uploadMultiple(images);
    }

    if (imagesKeys && imagesKeys.length > 0) {
      await this.prisma.image.deleteMany({
        where: {
          eventId,
          key: {
            in: imagesKeys,
          },
        },
      });
    }

    await this.prisma.eventDetail.deleteMany({
      where: {
        eventId,
      },
    });

    await this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        about,
        from,
        name,
        paid,
        to,
        emails,
        guidlines,
        websiteUrl,
        phoneNumbers,
        price,
        registrationUrl,
        ...(images &&
          images.length > 0 && {
            images: {
              create: imagesData.map((imageData) => ({
                url: imageData.url,
                key: imageData.key,
              })),
            },
          }),
        details: {
          create: details.map((detail) => ({
            name: detail.name,
            about: detail.about,
            from: detail.from,
            to: detail.to,
            type: detail.type,
            ...(detail.venue && {
              venue: {
                create: {
                  mapUrl: detail.venue?.mapUrl,
                  name: detail.venue?.name,
                },
              },
            }),
          })),
        },
      },
    });

    return {
      success: true,
      message: 'event updated successfully',
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
    await this.uploaderService.deleteMultiple(
      event.images.map((image) => image.key),
    );

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
