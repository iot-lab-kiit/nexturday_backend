import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { FirebaseProvider } from '../libs/firebase';

export class HomeService {
  private firebaseProvider: typeof FirebaseProvider;

  constructor() {
    this.firebaseProvider = FirebaseProvider;
  }

  async welcome(token: string): Promise<DecodedIdToken> {
    const userInfo = await getAuth(
      this.firebaseProvider.firebase,
    ).verifyIdToken(token);
    return userInfo;
  }
}
