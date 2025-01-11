import { PrismaClient } from '@prisma/client';
import { IParticipant, IResponse } from '../../interfaces';
import {
  CreateParticipantDto,
  UpdateParticipantDetailDto,
} from '../../common/dtos';
import { CustomError } from '../../utils';

export class ParticipantService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createParticipant(dto: CreateParticipantDto): Promise<void> {
    const { email, rollNo, uid, imageUrl } = dto;

    const society = await this.prisma.society.findUnique({
      where: {
        email,
      },
    });
    if (society) {
      throw new CustomError('email already registered as society', 400);
    }
    await this.prisma.participant.create({
      data: {
        email,
        rollNo,
        imageUrl,
        uid,
      },
    });
  }

  async getProfile(uid: string): Promise<IResponse<IParticipant>> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        uid,
      },
      include: {
        detail: true,
      },
    });

    return {
      success: true,
      message: 'profile fetched successfully',
      data: participant,
    };
  }

  async updateProfile(
    participantId: string,
    dto: UpdateParticipantDetailDto,
  ): Promise<IResponse> {
    const { branch, phoneNumber, studyYear, whatsappNumber, name } = dto;
    await this.prisma.participantDetail.upsert({
      where: {
        participantId,
      },
      create: {
        branch,
        phoneNumber,
        whatsappNumber,
        studyYear,
        name,
        participant: {
          connect: {
            id: participantId,
          },
        },
      },
      update: {
        branch,
        phoneNumber,
        whatsappNumber,
        studyYear,
        name,
      },
    });

    return {
      success: true,
      message: 'participant detail updated successfully',
    };
  }
}
