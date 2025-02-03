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
    const {
      isKiitStudent,
      personalEmail,
      universityEmail,
      rollNo,
      uid,
      imageUrl,
    } = dto;

    const society = await this.prisma.society.findFirst({
      where: {
        OR: [
          {
            email: universityEmail,
          },
          {
            email: personalEmail,
          },
        ],
      },
    });
    if (society) {
      throw new CustomError('email already registered as society', 400);
    }
    await this.prisma.participant.create({
      data: {
        isKiitStudent,
        personalEmail,
        universityEmail,
        rollNo,
        imageUrl,
        uid,
      },
    });
  }

  async getProfile(participantId: string): Promise<IResponse<IParticipant>> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        id: participantId,
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

  async updateProfile(dto: UpdateParticipantDetailDto): Promise<IResponse> {
    const {
      branch,
      phoneNumber,
      studyYear,
      whatsappNumber,
      countryCode,
      firstname,
      lastname,
      participantId,
    } = dto;
    await this.prisma.participantDetail.upsert({
      where: {
        participantId,
      },
      create: {
        branch,
        phoneNumber,
        whatsappNumber,
        studyYear,
        firstname,
        lastname,
        countryCode,
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
        firstname,
        lastname,
        countryCode,
      },
    });

    return {
      success: true,
      message: 'participant detail updated successfully',
    };
  }
}
