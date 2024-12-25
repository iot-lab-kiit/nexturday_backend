import { credential } from 'firebase-admin';
import { App, initializeApp } from 'firebase-admin/app';
import 'dotenv/config';

class Firebase {
  public firebase: App;

  constructor() {
    const CERT = JSON.parse(process.env.PRIVATE_KEY as string).key;
    console.log(CERT);
    this.firebase = initializeApp({
      credential: credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: CERT,
        clientEmail: process.env.CLIENT_EMAIL,
      }),
    });
  }
}

export const FirebaseProvider = new Firebase();
