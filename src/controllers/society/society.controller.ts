import { NextFunction, Request, Response } from 'express';
import { SocietyService } from '../../services';
import { MethodBinder } from '../../utils';
import { IUser } from '../../interfaces/express/user.interface';
import { plainToInstance } from 'class-transformer';
import { UpdateSocietyDto } from '../../common/dtos/society';

export class SocietyController {
  private societyService: SocietyService;

  constructor() {
    MethodBinder.bind(this);
    this.societyService = new SocietyService();
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.societyService.getProfile(
        (req.user as IUser).sub,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.societyService.deleteProfile(
        (req.user as IUser).sub,
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
      const societyId = (req.user as IUser).sub;
      const dto = plainToInstance(UpdateSocietyDto, { ...req.body, societyId });
      const result = await this.societyService.updateProfile(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
