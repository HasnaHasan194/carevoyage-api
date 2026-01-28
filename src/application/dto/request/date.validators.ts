import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "IsNotPastDate", async: false })
export class IsNotPastDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return true;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  }

  defaultMessage() {
    return "Date must be today or a future date";
  }
}

@ValidatorConstraint({ name: "IsEndDateAfterStartDate", async: false })
export class IsEndDateAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDateString: string, args: ValidationArguments) {
    if (!endDateString) return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const object = args.object as any;
    if (!object.startDate) return true;
    
    const startDate = new Date(object.startDate);
    const endDate = new Date(endDateString);
    return endDate >= startDate;
  }

  defaultMessage() {
    return "End date must be greater than or equal to start date";
  }
}
