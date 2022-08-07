import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getDay, getHours, getMinutes, getSeconds } from 'date-fns';

interface Props {
  startTimeOfWorkHour: number;
  lunchHour: number;
  endTimeOfWorkHour: number;
}
export function IsValidAppointmentTimes(
  property: Props,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsValidAppointmentTimesConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isValidAppointmentTimes' })
export class IsValidAppointmentTimesConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const [openingHours] = args.constraints;
    const { startTimeOfWorkHour, lunchHour, endTimeOfWorkHour } =
      openingHours as Props;
    const isValidOpeningHours =
      getHours(value) >= startTimeOfWorkHour &&
      getHours(value) !== lunchHour &&
      getHours(value) <= endTimeOfWorkHour &&
      getMinutes(value) === 0 &&
      getSeconds(value) === 0 &&
      getDay(value) !== 0; // sunday not open

    return isValidOpeningHours;
  }
  defaultMessage(args: ValidationArguments) {
    return 'Opening hours are 8am to 11am and 1pm to 8pm. Not open sunday!';
  }
}
