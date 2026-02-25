import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IListAgencySpecialNeedsUsecase } from "../../interfaces/agency-special-needs/list-agency-special-needs.interface";
import {
  IGetPackageSpecialNeedsForBookingUseCase,
  ClientSpecialNeedOptionDTO,
} from "../../interfaces/booking/get-package-special-needs-for-booking.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class GetPackageSpecialNeedsForBookingUseCase
  implements IGetPackageSpecialNeedsForBookingUseCase
{
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IListAgencySpecialNeedsUsecase")
    private _listAgencySpecialNeedsUsecase: IListAgencySpecialNeedsUsecase
  ) {}

  async execute(packageId: string): Promise<ClientSpecialNeedOptionDTO[]> {
    const pkg = await this._packageRepository.findById(packageId);
    if (!pkg) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    const list = await this._listAgencySpecialNeedsUsecase.execute(
      pkg.agencyId,
      false
    );

    const active = list.filter((item) => item.isActive && !item.isDeleted);

    return active.map((item) => ({
      id: item.id,
      specialNeedId: item.specialNeedId,
      name: item.specialNeed?.name ?? "Special support",
      unit: item.unit,
      price: item.price,
    }));
  }
}
