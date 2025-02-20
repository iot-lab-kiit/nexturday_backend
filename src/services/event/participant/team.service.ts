import { PrismaClient } from '@prisma/client';
import {
  IAllEvents,
  IPaginatedData,
  IResponse,
  ITeam,
} from '../../../interfaces';
import { CustomError } from '../../../utils';
import { TAKE_PAGES } from '../../../common/constants';
import { SearchDto } from '../../../common/dtos';

export class TeamService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // async joinEvent(participantId: string, eventId: string): Promise<IResponse> {
  //   const participantDetail = await this.prisma.participantDetail.findUnique({
  //     where: {
  //       participantId,
  //     },
  //   });
  //   if (!participantDetail) {
  //     throw new CustomError('participant details not found', 404);
  //   }
  //   const event = await this.prisma.event.findUnique({
  //     where: {
  //       id: eventId,
  //     },
  //   });
  //   if (!event) {
  //     throw new CustomError('event not found', 404);
  //   }
  //   if ((event.deadline as Date).getTime() < Date.now()) {
  //     throw new CustomError('registration deadline over', 400);
  //   }
  //   if ((event?.to as Date).getTime() < Date.now()) {
  //     throw new CustomError('event finished', 400);
  //   }
  //   if (event?.paid === true) {
  //     throw new CustomError('paid event', 400);
  //   }
  //   const registered = await this.prisma.eventParticipant.findUnique({
  //     where: {
  //       participantId_eventId: {
  //         eventId,
  //         participantId,
  //       },
  //     },
  //   });
  //   if (registered) {
  //     throw new CustomError('event already joined', 400);
  //   }
  //   await this.prisma.eventParticipant.create({
  //     data: {
  //       eventId,
  //       participantId,
  //     },
  //   });

  //   await this.prisma.event.update({
  //     where: {
  //       id: eventId,
  //     },
  //     data: {
  //       participationCount: {
  //         increment: 1,
  //       },
  //     },
  //   });

  //   return {
  //     success: true,
  //     message: 'event joined successfully',
  //   };
  // }

  async getAllJoinedEvents(
    participantId: string,
    dto: SearchDto,
  ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
    const totalJoinedEvents = await this.prisma.team.count({
      where: {
        OR: [
          { leaderId: participantId },
          {
            members: {
              some: {
                participantId,
              },
            },
          },
        ],
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
        teams: {
          some: {
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

  async createTeam(participantId: string, eventId: string): Promise<IResponse> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        id: participantId,
      },
      include: {
        detail: true,
      },
    });
    if (!participant?.detail) {
      throw new CustomError('participant details not found', 404);
    }
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!event || !event.isApproved) {
      throw new CustomError('event not found', 404);
    }
    if ((event.deadline as Date).getTime() < Date.now()) {
      throw new CustomError('registration deadline over', 400);
    }
    if ((event?.to as Date).getTime() < Date.now()) {
      throw new CustomError('event finished', 400);
    }
    if (event?.paid === true) {
      throw new CustomError('paid event', 400);
    }
    if (!event.isOutsideParticipantAllowed && !participant.isKiitStudent) {
      throw new CustomError('event allowed for kiit students only', 400);
    }
    const registered = await this.prisma.team.findFirst({
      where: {
        eventId,
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
    });
    if (registered) {
      throw new CustomError('event already joined', 400);
    }
    await this.prisma.team.create({
      data: {
        eventId,
        leaderId: participantId,
      },
    });

    await this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        teamCount: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      message: 'team created successfully',
    };
  }

  async joinTeam(participantId: string, teamId: string): Promise<IResponse> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        id: participantId,
      },
      include: {
        detail: true,
      },
    });
    if (!participant?.detail) {
      throw new CustomError('participant details not found', 404);
    }
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
        event: true,
      },
    });
    if (!team?.event || !team.event.isApproved) {
      throw new CustomError('event not found', 404);
    }
    if (!team) {
      throw new CustomError('team not found', 404);
    }
    if ((team.event.deadline as Date).getTime() < Date.now()) {
      throw new CustomError('registration deadline over', 400);
    }
    if ((team.event?.to as Date).getTime() < Date.now()) {
      throw new CustomError('event finished', 400);
    }
    if (team.event?.paid === true) {
      throw new CustomError('paid event', 400);
    }
    if (team.event.maxTeamSize === team._count.members + 1) {
      throw new CustomError('team already full', 400);
    }
    if (!team.event.isOutsideParticipantAllowed && !participant.isKiitStudent) {
      throw new CustomError('event allowed for kiit students only', 400);
    }
    await this.prisma.teamMember.create({
      data: {
        participantId,
        teamId,
      },
    });

    return {
      success: true,
      message: 'team joined successfully',
    };
  }

  async getTeamDetails(teamId: string): Promise<IResponse<ITeam>> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
        event: {
          isApproved: true,
        },
      },
      include: {
        leader: {
          include: {
            detail: true,
          },
        },
        members: {
          include: {
            participant: {
              include: {
                detail: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'team details fetched successfully',
      data: team,
    };
  }
}
