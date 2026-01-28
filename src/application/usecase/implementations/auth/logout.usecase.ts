import { injectable } from "tsyringe";
import { ILogoutUseCase } from "../../interfaces/auth/logout-usecase.interface";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  async execute(): Promise<void> {
    return Promise.resolve();
  }
}











