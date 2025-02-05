import { PrismaClient } from '@prisma/client';
import {
  IAllEvents,
  IEventParticipant,
  IPaginatedData,
  IResponse,
} from '../../../interfaces';
import { SearchDto } from '../../../common/dtos';
import { TAKE_PAGES } from '../../../common/constants';

export class SocietyService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
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
    const totalTeams = await this.prisma.team.count({
      where: {
        eventId,
      },
    });
    const totalPages = Math.ceil(totalTeams / TAKE_PAGES);
    const nextPage = totalPages > dto.page ? dto.page + 1 : null;
    const teams = await this.prisma.team.findMany({
      skip: (dto.page - 1) * TAKE_PAGES,
      take: TAKE_PAGES,
      orderBy: dto.q
        ? [
            {
              leader: {
                _relevance: {
                  fields: ['universityEmail', 'rollNo'],
                  search: dto.q,
                  sort: 'desc',
                },
                detail: {
                  _relevance: {
                    fields: ['firstname', 'lastname'],
                    search: dto.q,
                    sort: 'desc',
                  },
                },
              },
            },
            { [dto.field]: dto.direction },
          ]
        : [{ [dto.field]: dto.direction }],
      where: {
        eventId,
        leader: dto.q
          ? {
              OR: [
                {
                  detail: {
                    firstname: { search: dto.q },
                    lastname: { search: dto.q },
                  },
                },
                {
                  universityEmail: { search: dto.q },
                },
                { rollNo: { search: dto.q } },
              ],
            }
          : undefined,
        members: {
          some: dto.q
            ? {
                participant: {
                  OR: [
                    {
                      detail: {
                        firstname: { search: dto.q },
                        lastname: { search: dto.q },
                      },
                    },
                    {
                      universityEmail: { search: dto.q },
                    },
                    { rollNo: { search: dto.q } },
                  ],
                },
              }
            : undefined,
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

    const filteredTeams = teams.filter((team) => {
      return team.members.some((member) => {
        return (
          member.participant.universityEmail === dto.q ||
          member.participant.rollNo === dto.q ||
          member.participant.detail?.firstname === dto.q ||
          member.participant.detail?.lastname === dto.q
        );
      });
    });

    return {
      success: true,
      message: 'participants fetched successfully',
      data: {
        currentPage: dto.page,
        nextPage,
        totalItems: totalTeams,
        totalPages,
        data: filteredTeams,
      },
    };
  }
}
