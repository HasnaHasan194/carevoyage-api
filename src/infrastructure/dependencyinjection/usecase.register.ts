import { container } from "tsyringe";
import { RegisterUsecase } from "../../application/usecase/implementations/auth/register.usecase";
import { LoginUsecase } from "../../application/usecase/implementations/auth/login.usecase";
import { RegisterAgencyUsecase } from "../../application/usecase/implementations/auth/agencyregister.usecase";
import { AgencyLoginUsecase } from "../../application/usecase/implementations/auth/agency-login.usecase";
import { AdminLoginUsecase } from "../../application/usecase/implementations/auth/admin-login.usecase";
import { SendOtpUsecase } from "../../application/usecase/implementations/auth/sendOtp.usecase";
import { ResendOtpUsecase } from "../../application/usecase/implementations/auth/resendOtp.usecase";
import { VerifyOtpUsecase } from "../../application/usecase/implementations/auth/verifyOtp.usecase";
import { VerifyOtpAndCreateUserUsecase } from "../../application/usecase/implementations/auth/verifyCreatinguser.usecase";
import { VerifyOtpAndCreateAgencyUsecase } from "../../application/usecase/implementations/auth/verifyCreatingAgency.usecase";
import { ICheckUserAndSendOtpUsecase } from "../../application/usecase/interfaces/check-user-verify-usecase.interface";
import { CheckUserAndSendOtpUsecase } from "../../application/usecase/implementations/checkUserAndSendOtpUsecase";
import { IGenerateTokenUseCase } from "../../application/usecase/interfaces/auth/generate-token.usecase.interface";
import { GenerateTokenUseCase } from "../../application/usecase/implementations/auth/generateToken.usecase";
import { ILogoutUseCase } from "../../application/usecase/interfaces/auth/logout-usecase.interface";
import { LogoutUseCase } from "../../application/usecase/implementations/auth/logout.usecase";
import { IGetAllUsersUsecase } from "../../application/usecase/interfaces/admin/getallusers.interface";
import { GetAllUsersUsecase } from "../../application/usecase/implementations/admin/get-all-users.usecase";
import { IGetUserDetailsUsecase } from "../../application/usecase/interfaces/admin/get-user-details.interface";
import { GetUserDetailsUsecase } from "../../application/usecase/implementations/admin/get-user-details.usecase";
import { IBlockUnblockUserUsecase } from "../../application/usecase/interfaces/admin/blockUnblock.interface";
import { BlockUnblockUserUsecase } from "../../application/usecase/implementations/admin/block-unblock-user.usecase";
import { IRefreshTokenUsecase } from "../../application/usecase/interfaces/auth/refresh-token-usecase.interface";
import { RefreshTokenUsecase } from "../../application/usecase/implementations/auth/refresh-token.usecase";
import { IInviteCaretakerUseCase } from "../../application/usecase/interfaces/caretaker/invite-caretaker.interface";
import { InviteCaretakerUseCase } from "../../application/usecase/implementations/caretaker/invite-caretaker.usecase";
import { IVerifyCaretakerInviteUseCase } from "../../application/usecase/interfaces/caretaker/verify-caretaker-invite.interface";
import { VerifyCaretakerInviteUseCase } from "../../application/usecase/implementations/caretaker/verify-caretaker-invite.usecase";
import { ICaretakerSignupUseCase } from "../../application/usecase/interfaces/caretaker/caretaker-signup.interface";
import { CaretakerSignupUseCase } from "../../application/usecase/implementations/caretaker/caretaker-signup.usecase";
import { ICaretakerLoginUseCase } from "../../application/usecase/interfaces/auth/caretaker-login.interface";
import { CaretakerLoginUseCase } from "../../application/usecase/implementations/auth/caretaker-login.usecase";

export class UsecaseRegistory {
  static registerUsecase(): void {
    container.register("IRegisterUsecase", {
      useClass: RegisterUsecase,
    });

    container.register("ILoginUsecase", {
      useClass: LoginUsecase,
    });

    container.register("IRegisterAgencyUsecase", {
      useClass: RegisterAgencyUsecase,
    });

    container.register("IAgencyLoginUsecase", {
      useClass: AgencyLoginUsecase,
    });

    container.register("IAdminLoginUsecase", {
      useClass: AdminLoginUsecase,
    });

    container.register("ISendOtpUsecase", {
      useClass: SendOtpUsecase,
    });

    container.register("IResendOtpUsecase", {
      useClass: ResendOtpUsecase,
    });

    container.register("IVerifyOtpUsecase", {
      useClass: VerifyOtpUsecase,
    });

    container.register("IVerifyOtpAndCreateUserUsecase", {
      useClass: VerifyOtpAndCreateUserUsecase,
    });

    container.register("IVerifyOtpAndCreateAgencyUsecase", {
      useClass: VerifyOtpAndCreateAgencyUsecase,
    });

    container.register<ICheckUserAndSendOtpUsecase>(
      "ICheckUserAndSendOtpUsecase",
      {
        useClass: CheckUserAndSendOtpUsecase,
      }
    );

    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });

    container.register<ILogoutUseCase>("ILogoutUseCase", {
      useClass: LogoutUseCase,
    });

    // Admin use cases
    container.register<IGetAllUsersUsecase>("IGetAllUsersUsecase", {
      useClass: GetAllUsersUsecase,
    });

    container.register<IGetUserDetailsUsecase>("IGetUserDetailsUsecase", {
      useClass: GetUserDetailsUsecase,
    });

    container.register<IBlockUnblockUserUsecase>("IBlockUnblockUserUsecase", {
      useClass: BlockUnblockUserUsecase,
    });

    container.register<IRefreshTokenUsecase>("IRefreshTokenUsecase", {
      useClass: RefreshTokenUsecase,
    });

    // Caretaker use cases
    container.register<IInviteCaretakerUseCase>("IInviteCaretakerUseCase", {
      useClass: InviteCaretakerUseCase,
    });

    container.register<IVerifyCaretakerInviteUseCase>("IVerifyCaretakerInviteUseCase", {
      useClass: VerifyCaretakerInviteUseCase,
    });

    container.register<ICaretakerSignupUseCase>("ICaretakerSignupUseCase", {
      useClass: CaretakerSignupUseCase,
    });

    container.register<ICaretakerLoginUseCase>("ICaretakerLoginUseCase", {
      useClass: CaretakerLoginUseCase,
    });
  }
}
