import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import { authController } from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { LoginRequestDTO } from "../../../application/dto/request/login-request.dto";
import { RegisterRequestDTO } from "../../../application/dto/request/register-request.dto";
import { AgencyRegisterRequestDTO } from "../../../application/dto/request/agencyregister-request.dto";
import { AgencyLoginRequestDTO } from "../../../application/dto/request/agencylogin-request.dto";
import { AdminLoginRequestDTO } from "../../../application/dto/request/adminlogin-request.dto";
import { ResendOtpUsecase } from "../../../application/usecase/implementations/auth/resendOtp.usecase";
import { SendOtpRequestDTO } from "../../../application/dto/request/sentOtpRequestdto";
import { VerifyOtpRequestDTO } from "../../../application/dto/request/verifyotpRequestdto";
import { VerifyOtpAndCreateAgencyDTO } from "../../../application/dto/request/VerifyotpandcreateAgencydto";
import { CaretakerSignupRequestDTO } from "../../../application/dto/request/caretaker-signup-request.dto";
import { CaretakerLoginRequestDTO } from "../../../application/dto/request/caretaker-login-request.dto";
import { ForgotPasswordRequestDTO } from "../../../application/dto/request/forgot-password-request.dto";
import { ResetPasswordRequestDTO } from "../../../application/dto/request/reset-password-request.dto";
import { VerifyResetTokenRequestDTO } from "../../../application/dto/request/verify-reset-token-request.dto";
import { GoogleAuthRequestDTO } from "../../../application/dto/request/google-auth-request.dto";

@injectable()
export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/register",
      validationMiddleware(RegisterRequestDTO),
      asyncHandler(authController.register.bind(authController))
    );
    this.router.post(
      "/login",
      validationMiddleware(LoginRequestDTO),
      asyncHandler(authController.login.bind(authController))
    );
    this.router.post(
      "/agency/signup",
      validationMiddleware(AgencyRegisterRequestDTO),
      asyncHandler(authController.registerAgency.bind(authController))
    );

    this.router.post(
      "/agency/login",
      validationMiddleware(AgencyLoginRequestDTO),
      asyncHandler(authController.loginAgency.bind(authController))
    );

    this.router.post(
      "/admin/login",
      validationMiddleware(AdminLoginRequestDTO),
      asyncHandler(authController.AdminLogin.bind(authController))
    );
    this.router.post(
      "/send-otp",
      validationMiddleware(SendOtpRequestDTO),
      asyncHandler(authController.signupSendOtp.bind(authController))
    );

    this.router.post(
      "/resend-otp",
      asyncHandler(authController.resendOtp.bind(authController))
    );

    this.router.post(
      "/verify-otp",
      validationMiddleware(VerifyOtpRequestDTO),
      asyncHandler(authController.verifyOtp.bind(authController))
    );

    this.router.post(
      "/verify-createuser",
      
      asyncHandler(authController.verifyOtpAndCreateUser.bind(authController))
    );
    this.router.post(
      "/verify-create-agency",
      
      asyncHandler(authController.verifyOtpAndCreateAgency.bind(authController))
    );

    this.router.post(
      "/logout",
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      "/refresh-token",
      asyncHandler(authController.refreshToken.bind(authController))
    );

    this.router.get(
      "/verify-caretaker-invite",
      asyncHandler(authController.verifyCaretakerInvite.bind(authController))
    );

    this.router.post(
      "/caretaker/signup",
      validationMiddleware(CaretakerSignupRequestDTO),
      asyncHandler(authController.caretakerSignup.bind(authController))
    );

    this.router.post(
      "/caretaker/login",
      validationMiddleware(CaretakerLoginRequestDTO),
      asyncHandler(authController.caretakerLogin.bind(authController))
    );

    this.router.post(
      "/forgot-password",
      validationMiddleware(ForgotPasswordRequestDTO),
      asyncHandler(authController.forgotPassword.bind(authController))
    );

    this.router.post(
      "/reset-password",
      validationMiddleware(ResetPasswordRequestDTO),
      asyncHandler(authController.resetPassword.bind(authController))
    );

    this.router.get(
      "/verify-reset-token",
      validationMiddleware(VerifyResetTokenRequestDTO),
      asyncHandler(authController.verifyResetToken.bind(authController))
    );

    this.router.post(
      "/google",
      // validationMiddleware(GoogleAuthRequestDTO),
      asyncHandler(authController.googleAuth.bind(authController))
    );
  }
}
