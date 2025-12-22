import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "MatchPassword", async: false })
export class MatchPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;
    return confirmPassword === object.password;
  }

  defaultMessage() {
    return "Passwords do not match";
  }
}
