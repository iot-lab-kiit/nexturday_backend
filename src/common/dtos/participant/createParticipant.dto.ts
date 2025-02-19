export class CreateParticipantDto {
  uid: string;
  universityEmail: string;
  isKiitStudent: boolean;
  imageUrl?: string;
  fcmToken?: string;
}
