import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

interface Props {
  model: 'user' | 'appointment';
  field: string;
  invert?: true;
  validators: ((value: any) => boolean)[];
}

export function ThereIsInDataBase(
  property: Props,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: CheckDataBaseConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ThereIsInDataBase' })
export class CheckDataBaseConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}
  async validate(value: any, args: ValidationArguments) {
    const [Property] = args.constraints;
    const { model, field, invert, validators } = Property as Props;

    const isValidResult = validators.map((validator) => {
      return validator(value);
    });

    const isValid = isValidResult.filter((result) => result === false);

    if (!(isValid.length === 0)) {
      return false;
    }

    if (invert) {
      return !(await this.prisma[model].findUnique({
        where: {
          [field]: value,
        },
      }));
    }
    return !!(await this.prisma[model].findUnique({
      where: {
        [field]: value,
      },
    }));
  }
  defaultMessage(args: ValidationArguments) {
    const fieldToUpperCase = `${args.property[0].toUpperCase()}${args.property.substring(
      1,
      args.property.length,
    )}`;
    return `${fieldToUpperCase} entered is not valid!`;
  }
}
