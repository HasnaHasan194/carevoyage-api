import { container, type ClassProvider } from "tsyringe";
import { IUserRepository } from "../../domain/repositoryInterfaces/User/user.repository.interface";
import { UserRepository } from "../repository/user/user.repository";
import { IAgencyRepository } from "../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { AgencyRepository } from "../repository/agency/agency.repository";
import { IAdminRepository } from "../../domain/repositoryInterfaces/Admin/admin.repository.interface";
import { AdminRepository } from "../repository/admin/admin.repository";
import { IEmailService } from "../../domain/service-interfaces/email-service.interface";
import { EmailService } from "../service/email.service";
import { ICaretakerProfileRepository } from "../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { CaretakerProfileRepository } from "../repository/caretaker/caretaker-profile.repository";
import { ITokenService } from "../../domain/service-interfaces/token-service-interfaces";
import { TokenService } from "../service/token.service";
import { IPackageRepository } from "../../domain/repositoryInterfaces/Package/package.repository.interface";
import { PackageRepository } from "../repository/package/package.repository";
import { IItineraryRepository } from "../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { ItineraryRepository } from "../repository/itinerary/itinerary.repository";
import { IActivityRepository } from "../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { ActivityRepository } from "../repository/activity/activity.repository";
import { ICategoryRepository } from "../../domain/repositoryInterfaces/Category/category.repository.interface";
import { CategoryRepository } from "../repository/category/category.repository";
import { IS3Service } from "../../domain/service-interfaces/s3-service.interface";
import { S3Service } from "../service/s3.service";
import { IDBSession } from "../../infrastructure/interface/session.interface";
import { MongooseDBSession } from "../../infrastructure/database/mongooseDBSession/mongooseDBSession";
import { IWishlistRepository } from "../../domain/repositoryInterfaces/Wishlist/wishlist.repository.interface";
import { WishlistRepository } from "../repository/wishlist/wishlist.repository";
import { ISpecialNeedsMasterRepository } from "../../domain/repositoryInterfaces/SpecialNeedsMaster/special-needs-master.repository.interface";
import { SpecialNeedsMasterRepository } from "../repository/special-needs-master/special-needs-master.repository";
import { IAgencySpecialNeedsRepository } from "../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { AgencySpecialNeedsRepository } from "../repository/agency-special-needs/agency-special-needs.repository";
import { IAgencySpecialNeedsMasterRepository } from "../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { AgencySpecialNeedsMasterRepository } from "../repository/agency-special-needs-master/agency-special-needs-master.repository";
import { IBookingRepository } from "../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { BookingRepository } from "../repository/booking/booking.repository";
import { ICaretakerRequestRepository } from "../../domain/repositoryInterfaces/CaretakerRequest/caretaker-request.repository.interface";
import { CaretakerRequestRepository } from "../repository/caretaker-request/caretaker-request.repository";
import { IWalletRepository } from "../../domain/repositoryInterfaces/Wallet/wallet.repository.interface";
import { WalletRepository } from "../repository/wallet/wallet.repository";
import { IWalletTransactionRepository } from "../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import { WalletTransactionRepository } from "../repository/wallet/wallet-transaction.repository";
import { IRefundRequestRepository } from "../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import { RefundRequestRepository } from "../repository/refund/refund-request.repository";
import { ISalesReportRepository } from "../../domain/repositoryInterfaces/SalesReport/sales-report.repository.interface";
import { SalesReportRepository } from "../repository/sales-report/sales-report.repository";
import { ICaretakerDashboardRepository } from "../../domain/repositoryInterfaces/CaretakerDashboard/caretaker-dashboard.repository.interface";
import { CaretakerDashboardRepository } from "../repository/caretaker-dashboard/caretaker-dashboard.repository";
import { IChatRepository } from "../../domain/repositoryInterfaces/Chat/chat.repository.interface";
import { ChatRepository } from "../repository/chat/chat.repository";
import { IAgencyReviewRepository } from "../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import { AgencyReviewRepository } from "../repository/agency-review/agency-review.repository";
import type { INotificationRepository } from "../../domain/repositoryInterfaces/Notification/notification.repository.interface";
import { NotificationRepository } from "../repository/notification/notification.repository";

export class RepositoryRegister {
  static registerRepository(): void {
    container.register<IUserRepository>(
      "IUserRepository",
      { useClass: UserRepository } as ClassProvider<IUserRepository>
    );

    container.register<IAgencyRepository>(
      "IAgencyRepository",
      { useClass: AgencyRepository } as ClassProvider<IAgencyRepository>
    );

    container.register<IAdminRepository>(
      "IAdminRepository",
      { useClass: AdminRepository } as ClassProvider<IAdminRepository>
    );

    container.register<IEmailService>(
      "IEmailService",
      { useClass: EmailService } as ClassProvider<IEmailService>
    );

    container.register<ICaretakerProfileRepository>(
      "ICaretakerProfileRepository",
      { useClass: CaretakerProfileRepository } as ClassProvider<ICaretakerProfileRepository>
    );

    container.register<ITokenService>(
      "ITokenService",
      { useClass: TokenService } as ClassProvider<ITokenService>
    );

    container.register<IPackageRepository>(
      "IPackageRepository",
      { useClass: PackageRepository } as ClassProvider<IPackageRepository>
    );

    container.register<IItineraryRepository>(
      "IItineraryRepository",
      { useClass: ItineraryRepository } as ClassProvider<IItineraryRepository>
    );

    container.register<IActivityRepository>(
      "IActivityRepository",
      { useClass: ActivityRepository } as ClassProvider<IActivityRepository>
    );

    container.register<ICategoryRepository>(
      "ICategoryRepository",
      { useClass: CategoryRepository } as ClassProvider<ICategoryRepository>
    );

    container.register<IS3Service>(
      "IS3Service",
      { useClass: S3Service } as ClassProvider<IS3Service>
    );

    container.register<IDBSession>(
      "IDBSession",
      { useClass: MongooseDBSession } as ClassProvider<IDBSession>
    );

    container.register<IWishlistRepository>(
      "IWishlistRepository",
      { useClass: WishlistRepository } as ClassProvider<IWishlistRepository>
    );

    container.register<ISpecialNeedsMasterRepository>(
      "ISpecialNeedsMasterRepository",
      { useClass: SpecialNeedsMasterRepository } as ClassProvider<ISpecialNeedsMasterRepository>
    );

    container.register<IAgencySpecialNeedsRepository>(
      "IAgencySpecialNeedsRepository",
      { useClass: AgencySpecialNeedsRepository } as ClassProvider<IAgencySpecialNeedsRepository>
    );

    container.register<IAgencySpecialNeedsMasterRepository>(
      "IAgencySpecialNeedsMasterRepository",
      { useClass: AgencySpecialNeedsMasterRepository } as ClassProvider<IAgencySpecialNeedsMasterRepository>
    );

    container.register<IBookingRepository>(
      "IBookingRepository",
      { useClass: BookingRepository } as ClassProvider<IBookingRepository>
    );

    container.register<ICaretakerRequestRepository>(
      "ICaretakerRequestRepository",
      { useClass: CaretakerRequestRepository } as ClassProvider<ICaretakerRequestRepository>
    );

    container.register<IWalletRepository>(
      "IWalletRepository",
      { useClass: WalletRepository } as ClassProvider<IWalletRepository>
    );

    container.register<IWalletTransactionRepository>(
      "IWalletTransactionRepository",
      {
        useClass: WalletTransactionRepository,
      } as ClassProvider<IWalletTransactionRepository>
    );

    container.register<IRefundRequestRepository>(
      "IRefundRequestRepository",
      {
        useClass: RefundRequestRepository,
      } as ClassProvider<IRefundRequestRepository>
    );

    container.register<ISalesReportRepository>(
      "ISalesReportRepository",
      {
        useClass: SalesReportRepository,
      } as ClassProvider<ISalesReportRepository>
    );

    container.register<ICaretakerDashboardRepository>(
      "ICaretakerDashboardRepository",
      {
        useClass: CaretakerDashboardRepository,
      } as ClassProvider<ICaretakerDashboardRepository>
    );

    container.register<IChatRepository>(
      "IChatRepository",
      {
        useClass: ChatRepository,
      } as ClassProvider<IChatRepository>
    );

    container.register<IAgencyReviewRepository>(
      "IAgencyReviewRepository",
      {
        useClass: AgencyReviewRepository,
      } as ClassProvider<IAgencyReviewRepository>
    );

    container.register<INotificationRepository>(
      "INotificationRepository",
      {
        useClass: NotificationRepository,
      } as ClassProvider<INotificationRepository>
    );
  }
}
