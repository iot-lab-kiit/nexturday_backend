import { Router } from 'express';
import { ParticipantController } from '../../controllers';

export class ParticipantRoute {
  public router: Router;
  private participantController: ParticipantController;

  constructor() {
    this.router = Router();
    this.participantController = new ParticipantController();
  }

  initializeRoutes() {
    this.router.post('/', this.participantController.createParticipant);
    this.router.get('/', this.participantController.getProfile);
    this.router.patch('/', this.participantController.updateProfile);
  }
}
