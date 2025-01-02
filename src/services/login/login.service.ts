import {Prisma, PrismaClient} from '@prisma/client';
import { CustomError } from '../../utils';
import { loginDto } from '../../common/dtos/login';
import { IResponse } from '../../interfaces';
import bcrypt from 'bcrypt';

export class LoginService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async checkLogin(dto: loginDto): Promise<IResponse<Prisma.SocietyGetPayload<{}>>> {
    const { email, password } = dto;

    const society = await this.prisma.society.findFirst({
      where: {
        email,
      },
    });
    if (!society) {
      throw new CustomError("society doesn't exist", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, society.password);
    if (!isPasswordValid) {
      throw new CustomError("Invalid password", 400);
    }

    return {
      success: true,
      message: 'Logged in successfully',
      data: society,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}