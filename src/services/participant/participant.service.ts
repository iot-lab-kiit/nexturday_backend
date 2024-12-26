import { PrismaClient } from '@prisma/client';
import { IParticipant, IResponse } from '../../interfaces';
import { CreateParticipantDto, UpdateParticipantDto } from '../../common/dtos';
import { CustomError } from '../../utils';

export class ParticipantService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createParticipant(
    dto: CreateParticipantDto,
  ): Promise<IResponse<IParticipant>> {
    const {
      branch,
      email,
      name,
      phoneNumber,
      rollNo,
      studyYear,
      uid,
      whatsappNumber,
      imageUrl,
    } = dto;

    const society = await this.prisma.society.findUnique({
      where: {
        uid,
      },
    });
    if (society) {
      throw new CustomError('email already registered as society', 400);
    }
    const participant = await this.prisma.participant.create({
      data: {
        branch,
        email,
        name,
        phoneNumber,
        rollNo,
        studyYear,
        uid,
        whatsappNumber,
        imageUrl,
      },
    });

    return {
      success: true,
      message: 'participant created successfully',
      data: participant,
    };
  }

  async getProfile(uid: string): Promise<IResponse<IParticipant>> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        uid,
      },
    });

    return {
      success: true,
      message: 'profile fetched successfully',
      data: participant,
    };
  }

  async updateProfile(
    uid: string,
    dto: UpdateParticipantDto,
  ): Promise<IResponse> {
    const { branch, phoneNumber, studyYear, whatsappNumber } = dto;
    await this.prisma.participant.update({
      where: {
        uid,
      },
      data: {
        branch,
        phoneNumber,
        whatsappNumber,
        studyYear,
      },
    });

    return {
      success: true,
      message: 'participant updated successfully',
    };
  }
}
