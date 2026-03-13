import { inject, injectable } from "tsyringe";
import type {
  IListCaretakerTripsUseCase,
  ListCaretakerTripsParams,
} from "../../interfaces/caretaker/list-caretaker-trips.interface";
import type { PaginatedCaretakerTripsResponseDTO } from "../../../dto/response/caretaker-trips-response.dto";
import type { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import type { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class ListCaretakerTripsUseCase implements IListCaretakerTripsUseCase {
  constructor(
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(
    params: ListCaretakerTripsParams
  ): Promise<PaginatedCaretakerTripsResponseDTO> {
    const { userId, page, limit } = params;

    const profile = await this._caretakerProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError(ERROR_MESSAGE.CARETAKER.PROFILE_NOT_FOUND);
    }

    const caretakerProfileId = profile._id;

    const [bookings, totalItems] = await Promise.all([
      this._bookingRepository.findByCaretakerProfileIdPaginated(
        caretakerProfileId,
        page,
        limit
      ),
      this._bookingRepository.countByCaretakerProfileId(caretakerProfileId),
    ]);

    if (!bookings.length) {
      return {
        items: [],
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      };
    }

    const packageIds = new Set<string>();
    const clientIds = new Set<string>();

    bookings.forEach((b) => {
      packageIds.add(b.packageId);
      clientIds.add(b.clientId);
    });

    const [packages, clients] = await Promise.all([
      Promise.all(
        Array.from(packageIds).map((id) => this._packageRepository.findById(id))
      ),
      Promise.all(
        Array.from(clientIds).map((id) => this._userRepository.findById(id))
      ),
    ]);

    const packageById = new Map<string, NonNullable<(typeof packages)[number]>>();
    packages.forEach((pkg) => {
      if (pkg) packageById.set(pkg._id, pkg);
    });

    const userById = new Map<string, NonNullable<(typeof clients)[number]>>();
    clients.forEach((u) => {
      if (u) userById.set(u._id, u);
    });

    const items = bookings.map((booking) => {
      const pkg = packageById.get(booking.packageId);
      const client = userById.get(booking.clientId);

      const packageName = pkg?.PackageName ?? "Trip";

      let clientName = "Client";
      if (client) {
        const fullName = `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim();
        clientName = fullName || client.email || clientName;
      }

      const startDate = pkg?.startDate ?? booking.startDate;
      const endDate = pkg?.endDate ?? booking.startDate;

      const millisPerDay = 1000 * 60 * 60 * 24;
      const rawDays = Math.floor(
        (endDate.getTime() - startDate.getTime()) / millisPerDay
      );
      const tripDays = rawDays + 1;

      const dailyWage = profile.pricePerDay ?? 0;
      const totalIncome = dailyWage * (tripDays > 0 ? tripDays : 0);

      return {
        bookingId: booking._id,
        packageName,
        clientName,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: booking.status,
        dailyWage,
        totalIncome,
      };
    });

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    return {
      items,
      page,
      limit,
      totalItems,
      totalPages,
    };
  }
}

