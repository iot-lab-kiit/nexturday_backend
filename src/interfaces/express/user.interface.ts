export interface IFirebaseUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export interface IJwtUser extends Omit<IFirebaseUser, 'uid'> {
  sub: string;
}
