import { HTTP_STATUS } from "../../shared/constants/constants";
import { CustomError } from "./customError";

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.BAD_REQUEST, message);
    this.name = "ValidationError";
  }
}
