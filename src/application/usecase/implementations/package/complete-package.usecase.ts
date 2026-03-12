import { inject, injectable } from "tsyringe";
import { ICompletePackageUsecase } from "../../interfaces/package/complete-package.interface";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IItineraryRepository } from "../../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { PackageMapper } from "../../../mapper/package.mapper";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";
import type { ITripReviewNotificationService } from "../../../../domain/service-interfaces/trip-review-notification-service.interface";

@injectable()
export class CompletePackageUsecase implements ICompletePackageUsecase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IChatConversationProvisioner")
    private readonly _chatConversationProvisioner: IChatConversationProvisioner,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("ITripReviewNotificationService")
    private readonly _tripReviewNotificationService: ITripReviewNotificationService
  ) {}

  async execute(
    packageId: string,
    agencyId: string
  ): Promise<PackageResponseDTO> {
    const existingPackage = await this._packageRepository.findByIdAndAgencyId(
      packageId,
      agencyId
    );

    if (!existingPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

   
    if (existingPackage.status !== "published") {
      throw new ValidationError(
        ERROR_MESSAGE.PACKAGE.CANNOT_COMPLETE_STATUS(existingPackage.status)
      );
    }

    // Check if trip has ended
    const now = new Date();
    if (new Date(existingPackage.endDate) > now) {
      throw new ValidationError(ERROR_MESSAGE.PACKAGE.CANNOT_COMPLETE_BEFORE_TRIP_END);
    }

    // Mark as completed
    const completedPackage = await this._packageRepository.updateStatus(
      packageId,
      "completed"
    );

    if (!completedPackage) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    // Mark CONFIRMED bookings as COMPLETED for this package
    await this._bookingRepository.markConfirmedBookingsCompletedByPackageId(
      packageId
    );

    // When a trip is completed, release any BUSY caretakers attached
    const bookingsWithCaretakers = await this._bookingRepository.findByPackageId(
      packageId
    );
    for (const booking of bookingsWithCaretakers) {
      await this._chatConversationProvisioner.syncChatEnabledForBooking(
        booking._id,
        booking.status
      );
      if (booking.caretakerId) {
        await this._caretakerProfileRepository.updateAvailabilityStatus(
          booking.caretakerId,
          "AVAILABLE"
        );
      }
    }

    // Send review invite emails to clients for COMPLETED bookings
    const clientIds = bookingsWithCaretakers
      .filter((booking) => booking.status === "COMPLETED")
      .map((booking) => booking.clientId);

    if (clientIds.length > 0) {
      const uniqueClientIds = Array.from(new Set(clientIds));
      const clients = await Promise.all(
        uniqueClientIds.map((id) => this._userRepository.findById(id))
      );

      for (const booking of bookingsWithCaretakers) {
        if (booking.status !== "COMPLETED") {
          continue;
        }
        const clientIndex = uniqueClientIds.indexOf(booking.clientId);
        const client = clientIndex >= 0 ? clients[clientIndex] : null;
        if (!client?.email) {
          continue;
        }

        await this._tripReviewNotificationService.sendTripReviewInvite({
          bookingId: booking._id,
          clientId: booking.clientId,
          clientEmail: client.email,
          clientFirstName: client.firstName,
          packageName: completedPackage.PackageName,
        });
      }
    }

    // Fetch itinerary
    const itinerary = completedPackage.itineraryId
      ? await this._itineraryRepository.findById(completedPackage.itineraryId)
      : null;

    return PackageMapper.toPackageResponseDto(completedPackage, itinerary);
  }
}





