import { PrismaClient } from '@prisma/client';
import { FirebaseProvider } from '../../../libs/firebase';
import { getAuth } from 'firebase-admin/auth';
import { CustomError } from '../../../utils';
import { ParticipantService } from '../../participant';
import { IResponse } from '../../../interfaces';

export class VerifyTokenService {
  private prisma: PrismaClient;
  private firebaseProvider: typeof FirebaseProvider;
  private participantService: ParticipantService;

  constructor() {
    this.prisma = new PrismaClient();
    this.firebaseProvider = FirebaseProvider;
    this.participantService = new ParticipantService();
  }

  async verifyToken(token: string): Promise<IResponse> {
    const user = await getAuth(this.firebaseProvider.firebase).verifyIdToken(
      token,
    );

    if (!user.email?.endsWith('@kiit.ac.in')) {
      throw new CustomError('kiit email allowed', 401);
    }

    const participant = await this.prisma.participant.findUnique({
      where: {
        uid: user.uid,
      },
    });
    const email = user.email as string;
    if (!participant) {
      await this.participantService.createParticipant({
        universityEmail: email,
        isKiitStudent: email.endsWith('@kiit.ac.in') ? true : false,
        uid: user.uid,
        imageUrl: user.picture,
      });
    }

    return {
      success: true,
      message: 'valid token',
    };
  }
}
