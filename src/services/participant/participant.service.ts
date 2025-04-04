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
    const { isKiitStudent, universityEmail, uid, imageUrl, fcmToken } = dto;

    const society = await this.prisma.society.findFirst({
      where: {
        email: universityEmail,
      },
    });
    if (society) {
      throw new CustomError('email already registered as society', 400);
    }
    const rollNo = universityEmail.endsWith('@kiit.ac.in')
      ? universityEmail.split('@')[0]
      : null;
    await this.prisma.participant.create({
      data: {
        isKiitStudent,
        universityEmail,
        rollNo,
        imageUrl,
        uid,
        fcmToken,
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
      countryCodeWhatsapp,
      countryCode,
      firstname,
      lastname,
      personalEmail,
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
        countryCodeWhatsapp,
        countryCode,
        personalEmail,
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
        countryCodeWhatsapp,
        countryCode,
        personalEmail,
      },
    });

    return {
      success: true,
      message: 'participant detail updated successfully',
    };
  }
}
