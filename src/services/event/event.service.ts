import { PaymentStatus, PrismaClient } from '@prisma/client';
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
import { NotificationService } from '../firebaseCloudMessaging';

export class EventService {
  private prisma: PrismaClient;
  private uploaderService: UploaderService;
  private notificationService: NotificationService;

  constructor() {
    this.prisma = new PrismaClient();
    this.uploaderService = new UploaderService();
    this.notificationService = new NotificationService();
  }

  async getAllEvents(
    dto: SearchDto,
    role: string,
    isKiitStudent = true,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalEvents = await this.prisma.event.count({
      where: {
        AND: [
          role === 'PARTICIPANT'
            ? {
                to: {
                  gte: new Date(),
                },
              }
            : {},
          { isApproved: true },
        ],
      },
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
          role === 'PARTICIPANT'
            ? {
                to: {
                  gte: new Date(),
                },
              }
            : {},
          isKiitStudent ? {} : { isOutsideParticipantAllowed: true },
          { isApproved: true },
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
      omit: {
        transcript: role === 'PARTICIPANT' ? true : false,
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
    userId: string,
    role: string,
    eventId: string,
    isKiitStudent = true,
  ): Promise<IResponse<IEventById>> {
    let joined: boolean | undefined;
    let isFavorite: boolean | undefined;
    let isLeader: boolean | undefined;
    let paymentStatus: PaymentStatus | undefined;
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
      omit: {
        transcript: role === 'PARTICIPANT' ? true : false,
      },
    });

    if (!event || (!(event.societyId === userId) && !event.isApproved)) {
      throw new CustomError('event not found', 404);
    }

    if (!isKiitStudent && !event.isOutsideParticipantAllowed) {
      throw new CustomError('Unauthorised Exception', 401);
    }

    if (role === 'PARTICIPANT') {
      const participation = await this.prisma.team.findFirst({
        where: {
          AND: [
            { eventId },
            {
              OR: [
                {
                  leaderId: userId,
                },
                {
                  members: {
                    some: {
                      participantId: userId,
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
            participantId: userId,
          },
        },
      });

      isFavorite = favorite ? true : false;
      joined = participation ? true : false;
      isLeader = participation?.leaderId === userId ? true : false;
      paymentStatus = participation?.payment_status;
    }

    return {
      success: true,
      message: 'events fetched successfully',
      data: { ...(event as IEventById), joined, isFavorite, isLeader, paymentStatus },
    };
  }

  async createEvent(
    dto: EventDto,
    images?: Express.Multer.File[],
    paymentQr?: Express.Multer.File[]
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
      transcript,
      tags,
    } = dto;
    if (!images || images.length === 0) {
      throw new CustomError('images are required', 400);
    }
    const imagesData = await this.uploaderService.uploadMultiple(images);
    let paymentQrData;

    if (paymentQr && paymentQr.length > 0) {
      paymentQrData = await this.uploaderService.uploadSingle(paymentQr[0]);
    }
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
        ...(paymentQrData && {
          paymentQr: paymentQrData.url,
        }),
        tags,
        transcript,
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
    //send a notification to all participants

    this.notificationService
      .sendNotification(
        `Upcoming Event: "${name}"`,
        `A new event has been added for ${this.formatDate(from)}. Tap to view details and RSVP!`,
        true,
      )
      .catch((e) => console.dir(e,{depth: null}));

    return {
      success: true,
      message: 'event created successfully',
    };
  }

  formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  async updateTeamPaymentStatus(
    teamId: string,
    paymentStatus: PaymentStatus
  ): Promise<IResponse> {
    await this.prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        payment_status: paymentStatus,
      },
    });

    return {
      success: true,
      message: 'payment status updated successfully',
    };
  }

  async updateEvent(
    dto: UpdateEventDto,
    images?: Express.Multer.File[],
    paymentQr?: Express.Multer.File[]
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
      maxTeamSize,
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

    let paymentQrData;
    if (paymentQr && paymentQr.length > 0) {
      paymentQrData = await this.uploaderService.uploadSingle(paymentQr[0]);
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
        maxTeamSize,
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
        ...(paymentQrData && {
          paymentQr: paymentQrData.url,
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
