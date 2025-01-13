import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import 'reflect-metadata';

@ValidatorConstraint()
class IsNotPastContriant implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return new Date(value) >= new Date();
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `The "${validationArguments?.property}" date must be greater than or equal to the current date.`;
  }
}

export function IsNotPast(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotPastContriant,
    });
  };
}
