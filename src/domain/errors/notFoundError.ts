import { HTTP_STATUS } from "../../shared/constants/constants";
import {CustomError} from "../errors/customError"

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.NOT_FOUND, message);
    this.name = "NotFoundError";
  }
}