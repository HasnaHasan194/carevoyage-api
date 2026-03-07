import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IPreviewBookingPriceUseCase } from "../../interfaces/booking/preview-booking-price.interface";
import {
  PreviewBookingPriceResponseDTO,
  SpecialNeedLineItemDTO,
  CaretakerLineItemDTO,
} from "../../../dto/response/preview-booking-price-response.dto";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class PreviewBookingPriceUseCase implements IPreviewBookingPriceUseCase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IAgencySpecialNeedsRepository")
    private _agencySpecialNeedsRepository: IAgencySpecialNeedsRepository,
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(data: {
    packageId: string;
    specialNeedIds?: string[];
    caretakerId?: string;
  }): Promise<PreviewBookingPriceResponseDTO> {
    const pkg = await this._packageRepository.findById(data.packageId);
    if (!pkg) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }
    if (pkg.status !== "published") {
      throw new ValidationError(ERROR_MESSAGE.BOOKING.ONLY_PUBLISHED_CAN_BE_BOOKED);
    }

    const tripDays = this.getTripDays(pkg.startDate, pkg.endDate);
    const basePrice = pkg.basePrice;
    const specialNeeds: SpecialNeedLineItemDTO[] = [];
    let specialNeedsTotal = 0;

    if (data.specialNeedIds?.length) {
      for (const specialNeedId of data.specialNeedIds) {
        const agencyNeed =
          await this._agencySpecialNeedsRepository.findByAgencyIdAndSpecialNeedId(
            pkg.agencyId,
            specialNeedId
          );
        if (
          agencyNeed &&
          agencyNeed.isActive &&
          !agencyNeed.isDeleted
        ) {
          const total =
            agencyNeed.unit === "per_day"
              ? agencyNeed.price * tripDays
              : agencyNeed.price;
          const master =
            await this._agencySpecialNeedsMasterRepository.findByIdAndAgencyId(
              agencyNeed.specialNeedId,
              pkg.agencyId
            );
          specialNeeds.push({
            id: agencyNeed._id,
            name: master?.name ?? "Special support",
            unit: agencyNeed.unit,
            unitPrice: agencyNeed.price,
            total,
          });
          specialNeedsTotal += total;
        }
      }
    }

    let caretaker: CaretakerLineItemDTO | undefined;
    let caretakerTotal = 0;

    if (data.caretakerId) {
      const profile = await this._caretakerProfileRepository.findById(
        data.caretakerId
      );
      if (!profile) {
        throw new NotFoundError(ERROR_MESSAGE.BOOKING.CARETAKER_NOT_FOUND);
      }
      if (profile.agencyId !== pkg.agencyId) {
        throw new ValidationError(
          "Caretaker does not belong to this package's agency"
        );
      }
      if (profile.status !== "active") {
        throw new ValidationError(ERROR_MESSAGE.BOOKING.CARETAKER_NOT_AVAILABLE);
      }
      const pricePerDay = profile.pricePerDay ?? 0;
      caretakerTotal = pricePerDay * tripDays;
      let caretakerName: string = profile.email ?? "Caretaker";
      if (profile.userId) {
        const user = await this._userRepository.findById(profile.userId);
        if (user) {
          const fullName = `${user.firstName} ${user.lastName}`.trim();
          if (fullName) caretakerName = fullName;
        }
      }
      caretaker = {
        id: profile._id,
        name: caretakerName,
        profileImage: profile.profileImage,
        pricePerDay,
        total: caretakerTotal,
      };
    }

    const totalAmount = basePrice + specialNeedsTotal + caretakerTotal;

    return {
      basePrice,
      tripDays,
      specialNeeds,
      specialNeedsTotal,
      caretaker,
      caretakerTotal,
      totalAmount,
      currency: "inr",
    };
  }

  private getTripDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}
