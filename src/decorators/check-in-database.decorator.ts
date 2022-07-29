import { BadRequestException } from '@nestjs/common';
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
  validators?: Array<{
    validationCallback: (value: any) => boolean;
    message: string;
  }>;
}

export function CheckInDataBase(
  property: Props,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'checkInDataBase',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: CheckInDataBaseConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'CheckInDataBase' })
export class CheckInDataBaseConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}
  async validate(value: any, args: ValidationArguments) {
    const [Property] = args.constraints;
    const { model, field, invert, validators } = Property as Props;

    if (validators) {
      const validationResultArray = validators.map((obj) => {
        const { message, validationCallback } = obj;
        return { result: validationCallback(value), message };
      });
      const notAproveValidation = validationResultArray.filter(
        (obj) => obj.result === false,
      );

      if (!(notAproveValidation.length === 0)) {
        const errorMessages = notAproveValidation.map((obj) => obj.message);
        throw new BadRequestException(errorMessages);
      }
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
