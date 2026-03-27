import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import {
  authController,
  blockedUserMiddleware,
} from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { LoginRequestDTO } from "../../../application/dto/request/login-request.dto";
import { RegisterRequestDTO } from "../../../application/dto/request/register-request.dto";
import { AgencyRegisterRequestDTO } from "../../../application/dto/request/agencyregister-request.dto";
import { AgencyLoginRequestDTO } from "../../../application/dto/request/agencylogin-request.dto";
import { AdminLoginRequestDTO } from "../../../application/dto/request/adminlogin-request.dto";

import { SendOtpRequestDTO } from "../../../application/dto/request/sentOtpRequestdto";
import { VerifyOtpRequestDTO } from "../../../application/dto/request/verifyotpRequestdto";

import { CaretakerSignupRequestDTO } from "../../../application/dto/request/caretaker-signup-request.dto";
import { CaretakerLoginRequestDTO } from "../../../application/dto/request/caretaker-login-request.dto";
import { ForgotPasswordRequestDTO } from "../../../application/dto/request/forgot-password-request.dto";
import { ResetPasswordRequestDTO } from "../../../application/dto/request/reset-password-request.dto";
import { VerifyResetTokenRequestDTO } from "../../../application/dto/request/verify-reset-token-request.dto";
import { VerifyOldPasswordRequestDTO } from "../../../application/dto/request/verify-old-password-request.dto";
import { ChangePasswordRequestDTO } from "../../../application/dto/request/change-password-request.dto";
import { ReverifyAgencyRequestDTO } from "../../../application/dto/request/reverify-agency-request.dto";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { ROUTES } from "../routes.constants";

@injectable()
export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      ROUTES.AUTH.REGISTER,
      validationMiddleware(RegisterRequestDTO),
      asyncHandler(authController.register.bind(authController))
    );
    this.router.post(
      ROUTES.AUTH.LOGIN,
      validationMiddleware(LoginRequestDTO),
      asyncHandler(authController.login.bind(authController))
    );
    this.router.post(
      ROUTES.AUTH.AGENCY_SIGNUP,
      validationMiddleware(AgencyRegisterRequestDTO),
      asyncHandler(authController.registerAgency.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.AGENCY_LOGIN,
      validationMiddleware(AgencyLoginRequestDTO),
      asyncHandler(authController.loginAgency.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.ADMIN_LOGIN,
      validationMiddleware(AdminLoginRequestDTO),
      asyncHandler(authController.AdminLogin.bind(authController))
    );
    this.router.post(
      ROUTES.AUTH.SEND_OTP,
      validationMiddleware(SendOtpRequestDTO),
      asyncHandler(authController.signupSendOtp.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.RESEND_OTP,
      asyncHandler(authController.resendOtp.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.VERIFY_OTP,
      validationMiddleware(VerifyOtpRequestDTO),
      asyncHandler(authController.verifyOtp.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.VERIFY_CREATE_USER,

      asyncHandler(authController.verifyOtpAndCreateUser.bind(authController))
    );
    this.router.post(
      ROUTES.AUTH.VERIFY_CREATE_AGENCY,

      asyncHandler(authController.verifyOtpAndCreateAgency.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.LOGOUT,
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.REFRESH_TOKEN,
      asyncHandler(authController.refreshToken.bind(authController))
    );

    this.router.get(
      ROUTES.AUTH.VERIFY_CARETAKER_INVITE,
      asyncHandler(authController.verifyCaretakerInvite.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.CARETAKER_SIGNUP,
      validationMiddleware(CaretakerSignupRequestDTO),
      asyncHandler(authController.caretakerSignup.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.CARETAKER_LOGIN,
      validationMiddleware(CaretakerLoginRequestDTO),
      asyncHandler(authController.caretakerLogin.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.FORGOT_PASSWORD,
      validationMiddleware(ForgotPasswordRequestDTO),
      asyncHandler(authController.forgotPassword.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.RESET_PASSWORD,
      validationMiddleware(ResetPasswordRequestDTO),
      asyncHandler(authController.resetPassword.bind(authController))
    );

    this.router.get(
      ROUTES.AUTH.VERIFY_RESET_TOKEN,
      validationMiddleware(VerifyResetTokenRequestDTO),
      asyncHandler(authController.verifyResetToken.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.VERIFY_OLD_PASSWORD,
      asyncHandler(verifyAuth),
      validationMiddleware(VerifyOldPasswordRequestDTO),
      asyncHandler(authController.verifyOldPassword.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.CHANGE_PASSWORD,
      asyncHandler(verifyAuth),
      validationMiddleware(ChangePasswordRequestDTO),
      asyncHandler(authController.changePassword.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.AGENCY_REVERIFY,
      validationMiddleware(ReverifyAgencyRequestDTO),
      asyncHandler(authController.reverifyAgency.bind(authController))
    );

    this.router.post(
      ROUTES.AUTH.GOOGLE_AUTH,
      // validationMiddleware(GoogleAuthRequestDTO),
      asyncHandler(authController.googleAuth.bind(authController))
    );

    
    this.router.get(
      ROUTES.AUTH.ME,
      asyncHandler(verifyAuth),
      asyncHandler(blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware)),
      asyncHandler(authController.getMe.bind(authController))
    );

  }
}
