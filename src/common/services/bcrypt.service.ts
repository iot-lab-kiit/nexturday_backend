import { hash } from 'bcrypt';

export class BcryptService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await hash(password, saltRounds);
  }
}
