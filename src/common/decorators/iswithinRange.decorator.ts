import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
class IsWithinRangeContraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const [propertyNames]: any = validationArguments?.constraints;
    const from = (validationArguments?.object as any)[propertyNames?.from];
    const to = (validationArguments?.object as any)[propertyNames?.to];

    return value.every(
      (dto: any) =>
        new Date(dto.from) >= new Date(from) &&
        new Date(dto.to) <= new Date(to),
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `from and to should be within event duration`;
  }
}

export function IsWithinRange(
  property: { from: string; to: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsWithinRangeContraint,
    });
  };
}
