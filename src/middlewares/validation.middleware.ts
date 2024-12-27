import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { MethodBinder } from '../utils';

type TValidationConfig = [
  new () => object,
  keyof Pick<Request, 'body' | 'query' | 'params'>,
];

type TNonEmptyArray<T> = [T, ...T[]];

export class ValidationMiddleware {
  private validations: TNonEmptyArray<TValidationConfig>;

  constructor(...validations: TNonEmptyArray<TValidationConfig>) {
    MethodBinder.bind(this);
    this.validations = validations;
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      for (const [DtoClass, target] of this.validations) {
        const dto = plainToInstance(DtoClass, req[target]);
        await validateOrReject(dto, { whitelist: true });
        req[target] = dto;
      }
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
