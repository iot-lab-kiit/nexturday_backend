import { NextFunction, Request, Response } from 'express';
import { CustomError, MethodBinder } from '../../utils';
import { TNonEmptyArray } from '../../interfaces';

export class RoleMiddleware {
  private roles: string[];

  constructor(...roles: TNonEmptyArray<string>) {
    MethodBinder.bind(this);
    this.roles = roles;
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      let authorized: boolean = false;
      if (req.user?.role !== 'ADMIN')
          authorized = this.roles.some((role) => req.user?.role === role);
      else
          authorized = true;
      if (!authorized) {
        throw new CustomError('Unauthorized Exception 1', 401);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
