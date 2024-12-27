import { Router } from 'express';
import { ParticipantController } from '../../controllers';
import { ValidationMiddleware } from '../../middlewares';
import { CreateParticipantDto, UpdateParticipantDto } from '../../common/dtos';

export class ParticipantRoute {
  public router: Router;
  private participantController: ParticipantController;

  constructor() {
    this.router = Router();
    this.participantController = new ParticipantController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      new ValidationMiddleware([CreateParticipantDto, 'body']).validate,
      this.participantController.createParticipant,
    );
    this.router.get('/', this.participantController.getProfile);
    this.router.patch(
      '/',
      new ValidationMiddleware([UpdateParticipantDto, 'body']).validate,
      this.participantController.updateProfile,
    );
  }
}
