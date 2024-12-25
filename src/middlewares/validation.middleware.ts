import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { MethodBinder } from '../utils';

export class ValidationMiddleware {
  private dtoClass: any;

  constructor(DtoClass: any) {
    MethodBinder.bind(this);
    this.dtoClass = DtoClass;
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(this.dtoClass, req.body);
      await validateOrReject(dto, { whitelist: true });
      req.body = dto;
      next();
    } catch (errors: any) {
      if (Array.isArray(errors) && errors[0] instanceof ValidationError) {
        console.log(errors);
        const errorMessages = this.formatValidationErrors(errors);
        return res.status(400).json({
          success: false,
          message: 'Bad request exception',
          errors: errorMessages,
        });
      }
      next(errors);
    }
  }
  private formatValidationErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((error) => this.extractErrorMessages(error));
  }

  private extractErrorMessages(error: ValidationError): string[] {
    if (error.constraints) {
      return Object.values(error.constraints);
    }
    if (error.children && error.children.length > 0) {
      return error.children.flatMap((childError) =>
        this.extractErrorMessages(childError),
      );
    }
    return [];
  }
}
