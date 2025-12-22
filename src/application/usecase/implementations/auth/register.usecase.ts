import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../../../domain/entities/user.entity";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";
import { IRegisterUsecase } from "../../interfaces/auth/register-usecase.interface";

@injectable()
export class RegisterUsecase implements IRegisterUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}
  async execute(data: Partial<IUserEntity>): Promise<void> {
    if (!data.email || !data.phone) {
      throw new Error("email or phone required");
    }

    const isEmailExists = await this._userRepository.findByEmail(data.email);

    if (isEmailExists) {
      throw new Error("email already exists");
    }

    const isPhoneExists = await this._userRepository.findByPhone(data.phone);

    if (isPhoneExists) {
      throw new Error("phone already exists");
    }

    const hashedPassword = await hashPassword(data.password!);

    const dataToSave: Partial<IUserEntity> = {
      ...data,
      password: hashedPassword,
    };

    await this._userRepository.save(dataToSave);
  }
}
