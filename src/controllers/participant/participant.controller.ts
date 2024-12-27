import { NextFunction, Request, Response } from 'express';
import { ParticipantService } from '../../services';
import { MethodBinder } from '../../utils';
import { plainToInstance } from 'class-transformer';
import { CreateParticipantDto, UpdateParticipantDto } from '../../common/dtos';
import { IFirebaseUser } from '../../interfaces/express/user.interface';

export class ParticipantController {
  private participantService: ParticipantService;

  constructor() {
    MethodBinder.bind(this);
    this.participantService = new ParticipantService();
  }

  async createParticipant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rollNo = req.user?.email?.replace('@kiit.ac.in', '');
      const dto = plainToInstance(CreateParticipantDto, {
        ...req.body,
        ...req.user,
        rollNo,
      });
      const result = await this.participantService.createParticipant(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.participantService.getProfile(
        (req.user as IFirebaseUser)?.uid as string,
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
      const dto = plainToInstance(UpdateParticipantDto, req.body);
      const result = await this.participantService.updateProfile(
        (req.user as IFirebaseUser)?.uid as string,
        dto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
