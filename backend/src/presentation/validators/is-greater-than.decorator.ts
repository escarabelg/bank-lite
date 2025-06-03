import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from 'class-validator';

export function IsGreaterThan(
  min: number,
  validationOptions?: ValidationOptions
) {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName,
      constraints: [min],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return !isNaN(value) && parseFloat(value) > args.constraints[0];
        },
        defaultMessage(args: ValidationArguments) {
          return `Value must be greater than ${args.constraints[0]}`;
        }
      }
    });
  };
}
