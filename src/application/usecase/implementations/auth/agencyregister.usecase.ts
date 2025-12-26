import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { IRegisterAgencyUsecase } from "../../interfaces/auth/register-agency.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
// import { CustomError } from "../../../../domain/errors/customError";
@injectable()
export class RegisterAgencyUsecase implements IRegisterAgencyUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,

    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  async execute(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    agencyName: string;
    address: string;
    registrationNumber: string;
    description?: string;
  }): Promise<void> {

    // const numOfRegistration = await this._userRepository.countNumberOfCom();

    // if(numOfRegistration  > 1){
    //   throw new CustomError(HTTP_STATUS.BAD_REQUEST,"Only registration allowed")
    // }

    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

   
    const user = await this._userRepository.save({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password, 
      role: "agency_owner",
      isBlocked: false,
    });

   
    const existingAgency =
      await this._agencyRepository.findByRegistrationNumber(
        data.registrationNumber
      );

    if (existingAgency) {
      throw new Error("Registration number already exists");
    }


    await this._agencyRepository.save({
      userId: user._id,
      agencyName: data.agencyName,
      address: data.address,
      registrationNumber: data.registrationNumber,
      description: data.description,
      verificationStatus: "pending",
      isBlocked: false,
    });
  }
}

