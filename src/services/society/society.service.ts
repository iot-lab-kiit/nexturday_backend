import { PrismaClient } from '@prisma/client';
import { IResponse, ISociety } from '../../interfaces';
import { UpdateSocietyDto } from '../../common/dtos/society';
import { BcryptService } from '../../common/services';
import { CustomError } from '../../utils';

export class SocietyService {
  private prisma: PrismaClient;
  private bcryptService: BcryptService;

  constructor() {
    this.prisma = new PrismaClient();
    this.bcryptService = new BcryptService();
  }

  async getProfile(societyId: string): Promise<IResponse<ISociety>> {
    const society = await this.prisma.society.findUnique({
      where: {
        id: societyId,
      },
      omit: {
        password: true,
      },
    });

    return {
      success: true,
      message: 'profile fetched successfully',
      data: society,
    };
  }

  async deleteProfile(societyId: string): Promise<IResponse> {
    await this.prisma.society.delete({
      where: {
        id: societyId,
      },
    });

    return {
      success: true,
      message: 'society deleted successfully',
    };
  }

  async updateProfile(dto: UpdateSocietyDto): Promise<IResponse> {
    const { email, name, password, phoneNumber, websiteUrl, societyId } = dto;
    if (email) {
      const society = await this.prisma.society.findUnique({
        where: {
          email,
        },
      });
      const participant = await this.prisma.participant.findFirst({
        where: {
          OR: [
            {
              universityEmail: email,
            },
            {
              personalEmail: email,
            },
          ],
        },
      });
      if (society || participant) {
        throw new CustomError('email already exists', 400);
      }
    }

    await this.prisma.society.update({
      where: {
        id: societyId,
      },
      data: {
        email,
        name,
        phoneNumber,
        websiteUrl,
        ...(password !== undefined && {
          password: await this.bcryptService.hashPassword(password),
        }),
      },
    });

    return {
      success: true,
      message: 'society updated successfully',
    };
  }
}
