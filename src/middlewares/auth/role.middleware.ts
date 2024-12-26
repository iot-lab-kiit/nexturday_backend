import { NextFunction, Request, Response } from 'express';
import { CustomError, MethodBinder } from '../../utils';
import { IUser } from '../../interfaces/express/user.interface';

export class RoleMiddleware {
  private roles: string[];

  constructor(...roles: string[]) {
    this.roles = roles;
    MethodBinder.bind(this);
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const authorized = this.roles.some((role) => user.role === role);
      if (!authorized) {
        throw new CustomError('Unauthorised Exception', 401);
      }
    } catch (error) {
      next(error);
    }
  }
}
