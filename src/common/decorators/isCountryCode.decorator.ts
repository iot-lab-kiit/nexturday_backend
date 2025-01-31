import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CountryCodes } from '../constants';

class IsCountryCodeConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return CountryCodes.includes(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'country code is not valid';
  }
}

export function IsCountryCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCountryCodeConstraint,
    });
  };
}
