import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return (
      new Date(value) <
      new Date(
        (validationArguments?.object as any)[
          validationArguments?.constraints[0]
        ],
      )
    );
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `The "${validationArguments?.property}" date must be greater than the "${validationArguments?.constraints[0]}" date.`;
  }
}

export function IsBefore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsBeforeConstraint,
    });
  };
}
