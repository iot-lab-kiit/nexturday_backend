export interface IUser {
  sub: string;
  role: string;
  image?: string;
}

export interface IParticipant extends IUser {
  universityEmail: string;
  isKiitStudent: boolean;
  firstname: string;
  lastname: string;
}

export interface ISociety extends IUser {
  name: string;
  email: string;
}
