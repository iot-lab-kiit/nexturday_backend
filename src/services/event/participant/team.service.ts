import { PaymentStatus, PrismaClient } from '@prisma/client';
import {
    IAllEvents,
    ICreateTeam,
    IGetTeamId,
    IPaginatedData,
    IResponse,
    ITeam,
} from '../../../interfaces';
import {CustomError} from '../../../utils';
import {TAKE_PAGES} from '../../../common/constants';
import {SearchDto} from '../../../common/dtos';

export class TeamService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }




    async leaveTeam(teamId: string, userId: string, memberId?: string): Promise<{ success: boolean; message: string }> {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            include: { members: true, event: true },
        });

        if (!team) {
            throw new Error('Team not found');
        }

        const isLeader = team.leaderId === userId;

        if (isLeader && memberId) {
            await this.prisma.teamMember.delete({
                where: {
                    teamId_participantId: {
                        teamId: teamId,
                        participantId: memberId,
                    },
                },
            });
            return { success: true, message: 'Member kicked successfully' };
        } else if (isLeader) {
            await this.prisma.team.delete({
                where: { id: teamId },
            });
            await this.prisma.event.update({
                where: { id: team.eventId },
                data: {
                    teamCount: {
                        decrement: 1,
                    },
                },
            });
            return { success: true, message: 'Team deleted as leader left' };
        } else {
            await this.prisma.teamMember.delete({
                where: {
                    teamId_participantId: {
                        teamId: teamId,
                        participantId: userId,
                    },
                },
            });
            return { success: true, message: 'Left the team successfully' };
        }
    }

    async getAllJoinedEvents(
        participantId: string,
        dto: SearchDto,
    ): Promise<IResponse<IPaginatedData<IAllEvents>>> {
        const totalJoinedEvents = await this.prisma.team.count({
            where: {
                OR: [
                    {leaderId: participantId},
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
                    {[dto.field]: dto.direction},
                ]
                : [{[dto.field]: dto.direction}],
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
                            {name: {search: dto.q}},
                            {about: {search: dto.q}},
                            {society: {name: {search: dto.q}}},
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

    async getPaymentStatus(
        teamId: string,
    ): Promise<IResponse<{ payment_status: PaymentStatus }>> {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            select: { payment_status: true }
        });

        if (!team) {
            throw new CustomError('Team not found', 404);
        }

        return {
            success: true,
            message: 'Payment status fetched successfully',
            data: {
                payment_status: team.payment_status,
            },
        };
    }

    async updatePaymentId(
      participantId: string,
      teamId: string,
      paymentId: string,
    ): Promise<IResponse> {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) {
            throw new CustomError('Team not found', 404);
        }
        if (team.leaderId !== participantId) {
            throw new CustomError('Unauthorized, Not team leader', 401);
        }
        if (team.payment_status === PaymentStatus.VERIFIED) {
            return {
                success: true,
                message: 'Payment already verified',

            };
        }

        await this.prisma.team.update({
            where: { id: teamId },
            data: {
                payment_status: PaymentStatus.UNDER_VERIFICATION,
                paymentId: paymentId,
            },
        });

        return {
            success: true,
            message: 'Payment ID updated and status set to UNDER_VERIFICATION',
        };
    }


    async updateTeamName(
        participantId: string,
        teamId: string,
        teamName: string,
    ): Promise<IResponse> {
        const team = await this.prisma.team.findUnique({
            where: {
                id: teamId,
            },
        });
        if (!team) {
            throw new CustomError('team not found', 404);
        }
        if (team.leaderId !== participantId) {
            throw new CustomError('not authorized', 401);
        }
        await this.prisma.team.update({
            where: {
                id: teamId,
            },
            data: {
                name: teamName,
            },
        });

        return {
            success: true,
            message: 'team name updated successfully',
        };
    }


    async createTeam(
        participantId: string,
        eventId: string,
        teamName: string,
    ): Promise<IResponse<ICreateTeam>> {
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
        // if (event?.paid === true) {
        //     throw new CustomError('paid event', 400);
        // }
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
            throw new CustomError(
                `event already joined with teamId: ${registered.id}`,
                400,
            );
        }
        if (!teamName) {
            teamName = participant.detail.firstname + ' ' + participant.detail.lastname;
        }
        const team = await this.prisma.team.create({
            data: {
                name: teamName,
                eventId: eventId,
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
            data: team,
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
        // if (team.event?.paid === true) {
        //     throw new CustomError('paid event', 400);
        // }
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

    async getTeamId(
        participantId: string,
        eventId: string,
    ): Promise<IResponse<IGetTeamId>> {
        const team = await this.prisma.team.findFirst({
            where: {
                eventId,
                OR: [
                    {leaderId: participantId},
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

        if (!team) {
            throw new CustomError('event not joined', 400);
        }

        return {
            success: true,
            message: 'teamId fetched successfully',
            data: {
                teamId: team.id,
            },
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
