import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import {
  IGetAvailableCaretakersForBookingUseCase,
  AvailableCaretakerDTO,
} from "../../interfaces/booking/get-available-caretakers-for-booking.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class GetAvailableCaretakersForBookingUseCase
  implements IGetAvailableCaretakersForBookingUseCase
{
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(packageId: string): Promise<AvailableCaretakerDTO[]> {
    const pkg = await this._packageRepository.findById(packageId);
    if (!pkg) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    const profiles =
      await this._caretakerProfileRepository.findByAgencyId(pkg.agencyId);

    const available = profiles.filter(
      (p) =>
        p.status === "active" &&
        p.availabilityStatus === "AVAILABLE" &&
        !p.isDeleted &&
        (p.verificationStatus === "verified" || !p.verificationStatus)
    );

    return Promise.all(
      available.map(async (p) => {
        let name: string = p.email ?? "Caretaker";
        if (p.userId) {
          const user = await this._userRepository.findById(p.userId);
          if (user) {
            const fullName = `${user.firstName} ${user.lastName}`.trim();
            if (fullName) name = fullName;
          }
        }
        return {
          id: p._id,
          name,
          profileImage: p.profileImage,
          languages: p.languages ?? [],
          experienceYears: p.experienceYears ?? 0,
          pricePerDay: p.pricePerDay ?? 0,
          status: p.status,
          verificationStatus: p.verificationStatus,
        };
      })
    );
  }
}
