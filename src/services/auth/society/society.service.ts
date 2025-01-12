import { PrismaClient } from '@prisma/client';
import { CustomError } from '../../../utils';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ILogin, IPayload } from '../../../interfaces/auth/society';
import { IResponse } from '../../../interfaces';
import { LoginDto, SignupDto } from '../../../common/dtos/auth/society';
import { BcryptService } from '../../../common/services';

export class SocietyService {
  private prisma: PrismaClient;
  private bcryptService: BcryptService;

  constructor() {
    this.prisma = new PrismaClient();
    this.bcryptService = new BcryptService();
  }

  async login(dto: LoginDto): Promise<IResponse<ILogin>> {
    const { email, password } = dto;

    const society = await this.prisma.society.findUnique({
      where: {
        email,
      },
    });
    if (!society) {
      throw new CustomError("society doesn't exist", 400);
    }

    const isPasswordValid = await compare(password, society.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid password', 400);
    }

    const payload: IPayload = {
      sub: society.id,
      email: society.email,
      name: society.name,
    };
    const token = this.jwtToken(payload);

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken: token,
      },
    };
  }

  async signup(dto: SignupDto): Promise<IResponse> {
    const { email, password, name, phoneNumber, websiteUrl } = dto;

    const society = await this.prisma.society.findUnique({
      where: {
        email,
      },
    });
    const participant = await this.prisma.participant.findUnique({
      where: {
        email,
      },
    });
    if (society || participant) {
      throw new CustomError('email already exists', 400);
    }

    const hashedPassword = await this.bcryptService.hashPassword(password);

    await this.prisma.society.create({
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
    };
  }

  private jwtToken(payload: IPayload): string {
    return sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '48h',
    });
  }
}
