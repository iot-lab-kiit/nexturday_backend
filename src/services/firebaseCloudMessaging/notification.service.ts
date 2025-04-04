import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';

export class NotificationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async sendNotification(title: string, message: string, all: boolean, participantIds?: string[]): Promise<void> {
    let tokens: string[] = [];
    if (all) {
      tokens = await this.getAllTokens();
    }else {
      if (!participantIds) {
        return;
      }
      tokens = await this.getTokens(participantIds);
    }
    const payload = {
      notification: {
        title: title,
        body: message,
      },
    };


    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: tokens,
        notification: payload.notification,
      });
      console.log('Successfully sent message:');
      console.dir(response, { depth: null });
    } catch (error) {
      console.error('Error sending message:');
      console.dir(error, { depth: null });
    }
    if (all){
      try {
        const response= await admin.messaging().send({
          topic: 'all',
          notification: payload.notification,
        });
        console.log('Successfully sent message topic: all:', response);
      } catch (err) {
        console.error('Error sending message all:', err);
      }
    }
  }

  private async getAllTokens(): Promise<string[]> {
    const participants = await this.prisma.participant.findMany({
      select: { fcmToken: true },
    });
    return participants.map(participant => participant.fcmToken).filter(token => token !== null);
  }

  private async getTokens(participantIds: string[]): Promise<string[]> {
    const participants = await this.prisma.participant.findMany({
      where: { id: { in: participantIds } },
      select: { fcmToken: true },
    });
    return participants.map(participant => participant.fcmToken).filter(token => token !== null);
  }
}