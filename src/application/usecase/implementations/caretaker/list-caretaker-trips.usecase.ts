import { inject, injectable } from "tsyringe";
import type {
  IListCaretakerTripsUseCase,
  ListCaretakerTripsParams,
} from "../../interfaces/caretaker/list-caretaker-trips.interface";
import type { PaginatedCaretakerTripsResponseDTO } from "../../../dto/response/caretaker-trips-response.dto";
import type { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { ICaretakerDashboardRepository } from "../../../../domain/repositoryInterfaces/CaretakerDashboard/caretaker-dashboard.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class ListCaretakerTripsUseCase implements IListCaretakerTripsUseCase {
  constructor(
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("ICaretakerDashboardRepository")
    private readonly _dashboardRepository: ICaretakerDashboardRepository
  ) {}

  async execute(
    params: ListCaretakerTripsParams
  ): Promise<PaginatedCaretakerTripsResponseDTO> {
    const profile = await this._caretakerProfileRepository.findByUserId(
      params.userId
    );
    if (!profile) {
      throw new NotFoundError(ERROR_MESSAGE.CARETAKER.PROFILE_NOT_FOUND);
    }

    const { trips, total } =
      await this._dashboardRepository.getAssignedTripsPaginated(
        profile._id,
        params.page,
        params.limit
      );

    const totalPages = Math.ceil(total / params.limit);

    return {
      trips: trips.map((t) => ({
        bookingId: t.bookingId,
        packageName: t.packageName,
        clientName: t.clientName,
        startDate: t.startDate.toISOString(),
        endDate: t.endDate.toISOString(),
        status: t.status,
      })),
      total,
      page: params.page,
      limit: params.limit,
      totalPages,
    };
  }
}
