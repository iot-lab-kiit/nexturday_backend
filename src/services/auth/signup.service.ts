import { Prisma, PrismaClient } from '@prisma/client';
import { CustomError } from '../../utils';
import { loginDto, signupDto } from '../../common/dtos/login';
import { IResponse } from '../../interfaces';
import bcrypt from 'bcrypt';

export class SignupService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async societySignup(
    dto: signupDto,
  ): Promise<IResponse<Prisma.SocietyGetPayload<{}>>> {
    const { email, password, name, phoneNumber, websiteUrl } = dto;

    const society = await this.prisma.society.findFirst({
      where: {
        email,
      },
    });
    if (society) {
      throw new CustomError('email already associated with a society.', 400);
    }

    const hashedPassword = await this.hashPassword(password);

    const newSociety = await this.prisma.society.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        websiteUrl,
      },
    });

    return {
      success: true,
      message: 'SignedUp successfully',
      data: newSociety,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
