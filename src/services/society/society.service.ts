import { PrismaClient } from '@prisma/client';
import { IResponse, ISociety } from '../../interfaces';
import { UpdateSocietyDto } from '../../common/dtos/society';
import { BcryptService } from '../../common/services';

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

    await this.prisma.society.update({
      where: {
        id: societyId,
      },
      data: {
        ...(email !== undefined && { email }),
        ...(name !== undefined && { name }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(websiteUrl !== undefined && { websiteUrl }),
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
