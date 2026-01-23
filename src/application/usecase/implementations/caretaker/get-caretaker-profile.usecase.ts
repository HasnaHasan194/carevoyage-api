import { inject, injectable } from "tsyringe";
import { IGetCaretakerProfileUsecase } from "../../interfaces/caretaker/get-caretaker-profile.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { CaretakerProfileResponseMapper } from "../../../mapper/caretaker-profile-response.mapper";
import { CaretakerProfileResponseDTO } from "../../../dto/response/caretaker-profile-response.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class GetCaretakerProfileUsecase implements IGetCaretakerProfileUsecase {
  constructor(
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<CaretakerProfileResponseDTO> {
    // Get user data
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Get caretaker profile
    const profile = await this._caretakerProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError("Caretaker profile not found");
    }

    // Map to DTO
    return CaretakerProfileResponseMapper.toDTO(profile, user);
  }
}

