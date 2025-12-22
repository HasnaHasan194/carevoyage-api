import { CustomError } from "./customError";
export class AuthError extends CustomError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "AuthError";
  }
}
