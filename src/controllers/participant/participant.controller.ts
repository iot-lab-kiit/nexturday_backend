import { NextFunction, Request, Response } from 'express';
import { ParticipantService } from '../../services';
import { MethodBinder } from '../../utils';
import { plainToInstance } from 'class-transformer';
import { IParticipant } from '../../interfaces/express/user.interface';
import { UpdateParticipantDetailDto } from '../../common/dtos';

export class ParticipantController {
  private participantService: ParticipantService;

  constructor() {
    MethodBinder.bind(this);
    this.participantService = new ParticipantService();
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.participantService.getProfile(
        (req.user as IParticipant).sub,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const participantId = (req.user as IParticipant).sub;
      const dto = plainToInstance(UpdateParticipantDetailDto, {
        ...req.body,
        participantId,
      });
      const result = await this.participantService.updateProfile(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
