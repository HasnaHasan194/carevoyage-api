import { container, type ClassProvider } from "tsyringe";
import { IUserRepository } from "../../domain/repositoryInterfaces/User/user.repository.interface";
import { UserRepository } from "../repository/user/user.repository";
import { IAgencyRepository } from "../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
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
import { IS3Service } from "../../domain/service-interfaces/s3-service.interface";
import { S3Service } from "../service/s3.service";
import { IDBSession } from "../../infrastructure/interface/session.interface";
import { MongooseDBSession } from "../../infrastructure/database/mongooseDBSession/mongooseDBSession";



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

    container.register<IS3Service>(
      "IS3Service",
      { useClass: S3Service } as ClassProvider<IS3Service>
    );

    container.register<IDBSession>(
      "IDBSession",
      { useClass: MongooseDBSession } as ClassProvider<IDBSession>
    );
  }
}
