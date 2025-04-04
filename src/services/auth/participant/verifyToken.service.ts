import { PrismaClient } from '@prisma/client';
import { FirebaseProvider } from '../../../libs/firebase';
import { getAuth } from 'firebase-admin/auth';
import { CustomError } from '../../../utils';
import { ParticipantService } from '../../participant';
import { IResponse } from '../../../interfaces';
import { getMessaging } from 'firebase-admin/messaging';
import { VerifyTokenDto } from '../../../common/dtos/auth/participant';

export class VerifyTokenService {
  private prisma: PrismaClient;
  private firebaseProvider: typeof FirebaseProvider;
  private participantService: ParticipantService;

  constructor() {
    this.prisma = new PrismaClient();
    this.firebaseProvider = FirebaseProvider;
    this.participantService = new ParticipantService();
  }

  async verifyToken(token: string, dto: VerifyTokenDto): Promise<IResponse> {
    const user = await getAuth(this.firebaseProvider.firebase).verifyIdToken(
      token,
    );
    console.log("FCM TOKEN: ",dto.fcmToken);
    try {
      if (dto.fcmToken) {
        const msg_id = await getMessaging().send(
          {
            token: dto.fcmToken,
            notification: {
              title: 'Successfully Logged In',
              body: 'You have successfully logged in to the app',
            },
            android: {
              priority: 'normal',
            },
          },
          // true,
        );
        console.log('Message sent:', msg_id);
      }
    } catch (error) {
      throw new CustomError('fcm token invalid', 401);
    }

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
        fcmToken: dto.fcmToken,
      });
    } else {
      await this.prisma.participant.update({
        where: {
          id: participant.id,
        },
        data: {
          fcmToken: dto.fcmToken,
        },
      });
    }

    return {
      success: true,
      message: 'valid token',
    };
  }
}
