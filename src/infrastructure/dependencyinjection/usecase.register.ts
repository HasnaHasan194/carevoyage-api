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
import { IForgotPasswordUsecase } from "../../application/usecase/interfaces/auth/forgot-password.interface";
import { ForgotPasswordUsecase } from "../../application/usecase/implementations/auth/forgot-password.usecase";
import { IResetPasswordUsecase } from "../../application/usecase/interfaces/auth/reset-password.interface";
import { ResetPasswordUsecase } from "../../application/usecase/implementations/auth/reset-password.usecase";
import { IVerifyResetTokenUsecase } from "../../application/usecase/interfaces/auth/verify-reset-token.interface";
import { VerifyResetTokenUsecase } from "../../application/usecase/implementations/auth/verify-reset-token.usecase";
import { IReverifyAgencyUsecase } from "../../application/usecase/interfaces/auth/reverify-agency.interface";
import { ReverifyAgencyUsecase } from "../../application/usecase/implementations/auth/reverify-agency.usecase";
import { IGoogleAuthUsecase } from "../../application/usecase/interfaces/auth/google-auth.interface";
import { GoogleAuthUsecase } from "../../application/usecase/implementations/auth/google-auth.usecase";
import { IGetCurrentUserUsecase } from "../../application/usecase/interfaces/auth/get-current-user.interface";
import { GetCurrentUserUsecase } from "../../application/usecase/implementations/auth/get-current-user.usecase";
import { IGetUserProfileUsecase } from "../../application/usecase/interfaces/user/get-user-profile-usecase.interface";
import { GetUserProfileUsecase } from "../../application/usecase/implementations/user/get-user-profile.usecase";
import { IUpdateUserProfileUsecase } from "../../application/usecase/interfaces/user/update-user-profile.interface";
import { UpdateUserProfileUsecase } from "../../application/usecase/implementations/user/update-user-profile.usecase";
import { UserController } from "../../presentation/controllers/user/user-profile.controller";
import { BlockedUserMiddleware } from "../../presentation/middlewares/block.middleware";
import { IGetAllAgenciesUsecase } from "../../application/usecase/interfaces/admin/getallagencies.interface";
import { GetAllAgenciesUsecase } from "../../application/usecase/implementations/admin/get-all-agencies.usecase";
import { IGetAgencyDetailsUsecase } from "../../application/usecase/interfaces/admin/get-agency-details.interface";
import { GetAgencyDetailsUsecase } from "../../application/usecase/implementations/admin/get-agency-details.usecase";
import { IBlockUnblockAgencyUsecase } from "../../application/usecase/interfaces/admin/blockUnblockAgency.interface";
import { BlockUnblockAgencyUsecase } from "../../application/usecase/implementations/admin/block-unblock-agency.usecase";
import { IVerifyAgencyUsecase } from "../../application/usecase/interfaces/admin/verify-agency.interface";
import { VerifyAgencyUsecase } from "../../application/usecase/implementations/admin/verify-agency.usecase";
import { IRejectAgencyUsecase } from "../../application/usecase/interfaces/admin/reject-agency.interface";
import { RejectAgencyUsecase } from "../../application/usecase/implementations/admin/reject-agency.usecase";
import { ICreatePackageUsecase } from "../../application/usecase/interfaces/package/create-package.interface";
import { CreatePackageUsecase } from "../../application/usecase/implementations/package/create-package.usecase";
import { IUpdatePackageUsecase } from "../../application/usecase/interfaces/package/update-package.interface";
import { UpdatePackageUsecase } from "../../application/usecase/implementations/package/update-package.usecase";
import { IPublishPackageUsecase } from "../../application/usecase/interfaces/package/publish-package.interface";
import { PublishPackageUsecase } from "../../application/usecase/implementations/package/publish-package.usecase";
import { IGetAgencyPackagesUsecase } from "../../application/usecase/interfaces/package/get-agency-packages.interface";
import { GetAgencyPackagesUsecase } from "../../application/usecase/implementations/package/get-agency-packages.usecase";
import { IGetPackageByIdUsecase } from "../../application/usecase/interfaces/package/get-package-by-id.interface";
import { GetPackageByIdUsecase } from "../../application/usecase/implementations/package/get-package-by-id.usecase";
import { IUpdatePackageBasicUsecase } from "../../application/usecase/interfaces/package/update-package-basic.interface";
import { UpdatePackageBasicUsecase } from "../../application/usecase/implementations/package/update-package-basic.usecase";
import { IUpdatePackageImagesUsecase } from "../../application/usecase/interfaces/package/update-package-images.interface";
import { UpdatePackageImagesUsecase } from "../../application/usecase/implementations/package/update-package-images.usecase";
import { IUpdatePackageItineraryUsecase } from "../../application/usecase/interfaces/package/update-package-itinerary.interface";
import { UpdatePackageItineraryUsecase } from "../../application/usecase/implementations/package/update-package-itinerary.usecase";
import { IDeletePackageUsecase } from "../../application/usecase/interfaces/package/delete-package.interface";
import { DeletePackageUsecase } from "../../application/usecase/implementations/package/delete-package.usecase";
import { ICompletePackageUsecase } from "../../application/usecase/interfaces/package/complete-package.interface";
import { CompletePackageUsecase } from "../../application/usecase/implementations/package/complete-package.usecase";
import { ICancelPackageUsecase } from "../../application/usecase/interfaces/package/cancel-package.interface";
import { CancelPackageUsecase } from "../../application/usecase/implementations/package/cancel-package.usecase";
import { ICreateActivityUsecase } from "../../application/usecase/interfaces/activity/create-activity.interface";
import { CreateActivityUsecase } from "../../application/usecase/implementations/activity/create-activity.usecase";
import { IGetAllActivitiesUsecase } from "../../application/usecase/interfaces/activity/get-all-activities.interface";
import { GetAllActivitiesUsecase } from "../../application/usecase/implementations/activity/get-all-activities.usecase";
import { ISubmitCaretakerVerificationUsecase } from "../../application/usecase/interfaces/caretaker/submit-verification.interface";
import { SubmitCaretakerVerificationUsecase } from "../../application/usecase/implementations/caretaker/submit-verification.usecase";
import { IGetCaretakerProfileUsecase } from "../../application/usecase/interfaces/caretaker/get-caretaker-profile.interface";
import { GetCaretakerProfileUsecase } from "../../application/usecase/implementations/caretaker/get-caretaker-profile.usecase";
import { IBrowsePackagesUsecase } from "../../application/usecase/interfaces/package/browse-packages.interface";
import { BrowsePackagesUsecase } from "../../application/usecase/implementations/package/browse-packages.usecase";
import { IGetUpcomingClientPackagesUsecase } from "../../application/usecase/interfaces/package/get-upcoming-client-packages.interface";
import { GetUpcomingClientPackagesUsecase } from "../../application/usecase/implementations/package/get-upcoming-client-packages.usecase";
import { IGetAgencyProfileUsecase } from "../../application/usecase/interfaces/agency/get-agency-profile.interface";
import { GetAgencyProfileUsecase } from "../../application/usecase/implementations/agency/get-agency-profile.usecase";
import { IUpdateAgencyProfileUsecase } from "../../application/usecase/interfaces/agency/update-agency-profile.interface";
import { UpdateAgencyProfileUsecase } from "../../application/usecase/implementations/agency/update-agency-profile.usecase";
import { AgencyCategoryController } from "../../presentation/controllers/agency/agency-category.controller";
import { IAgencyCategoryController } from "../../presentation/interfaces/controllers/agency/agency-category.controller.interface";
import { ICreateCategoryUsecase } from "../../application/usecase/interfaces/category/create-category.interface";
import { CreateCategoryUsecase } from "../../application/usecase/implementations/category/create-category.usecase";
import { IUpdateCategoryUsecase } from "../../application/usecase/interfaces/category/update-category.interface";
import { UpdateCategoryUsecase } from "../../application/usecase/implementations/category/update-category.usecase";
import { IDeleteCategoryUsecase } from "../../application/usecase/interfaces/category/delete-category.interface";
import { DeleteCategoryUsecase } from "../../application/usecase/implementations/category/delete-category.usecase";
import { IListCategoriesUsecase } from "../../application/usecase/interfaces/category/list-categories.interface";
import { ListCategoriesUsecase } from "../../application/usecase/implementations/category/list-categories.usecase";
import { IListActiveCategoriesUsecase } from "../../application/usecase/interfaces/category/list-active-categories.interface";
import { ListActiveCategoriesUsecase } from "../../application/usecase/implementations/category/list-active-categories.usecase";
import { IAddToWishlistUsecase } from "../../application/usecase/interfaces/wishlist/add-to-wishlist.interface";
import { AddToWishlistUsecase } from "../../application/usecase/implementations/wishlist/add-to-wishlist.usecase";
import { IRemoveFromWishlistUsecase } from "../../application/usecase/interfaces/wishlist/remove-from-wishlist.interface";
import { RemoveFromWishlistUsecase } from "../../application/usecase/implementations/wishlist/remove-from-wishlist.usecase";
import { IGetWishlistUsecase } from "../../application/usecase/interfaces/wishlist/get-wishlist.interface";
import { GetWishlistUsecase } from "../../application/usecase/implementations/wishlist/get-wishlist.usecase";
import { ICheckWishlistStatusUsecase } from "../../application/usecase/interfaces/wishlist/check-wishlist-status.interface";
import { CheckWishlistStatusUsecase } from "../../application/usecase/implementations/wishlist/check-wishlist-status.usecase";
import { IListActiveSpecialNeedsMasterUsecase } from "../../application/usecase/interfaces/special-needs-master/list-active-special-needs-master.interface";
import { ListActiveSpecialNeedsMasterUsecase } from "../../application/usecase/implementations/special-needs-master/list-active-special-needs-master.usecase";
import { IEnableSpecialNeedUsecase } from "../../application/usecase/interfaces/agency-special-needs/enable-special-need.interface";
import { EnableSpecialNeedUsecase } from "../../application/usecase/implementations/agency-special-needs/enable-special-need.usecase";
import { IUpdateSpecialNeedUsecase } from "../../application/usecase/interfaces/agency-special-needs/update-special-need.interface";
import { UpdateSpecialNeedUsecase } from "../../application/usecase/implementations/agency-special-needs/update-special-need.usecase";
import { IToggleActiveStatusUsecase } from "../../application/usecase/interfaces/agency-special-needs/toggle-active-status.interface";
import { ToggleActiveStatusUsecase } from "../../application/usecase/implementations/agency-special-needs/toggle-active-status.usecase";
import { ISoftDeleteSpecialNeedUsecase } from "../../application/usecase/interfaces/agency-special-needs/soft-delete-special-need.interface";
import { SoftDeleteSpecialNeedUsecase } from "../../application/usecase/implementations/agency-special-needs/soft-delete-special-need.usecase";
import { IListAgencySpecialNeedsUsecase } from "../../application/usecase/interfaces/agency-special-needs/list-agency-special-needs.interface";
import { ListAgencySpecialNeedsUsecase } from "../../application/usecase/implementations/agency-special-needs/list-agency-special-needs.usecase";
import { ICreateAgencySpecialNeedsMasterUsecase } from "../../application/usecase/interfaces/agency-special-needs-master/create-agency-special-needs-master.interface";
import { CreateAgencySpecialNeedsMasterUsecase } from "../../application/usecase/implementations/agency-special-needs-master/create-agency-special-needs-master.usecase";
import { IUpdateAgencySpecialNeedsMasterUsecase } from "../../application/usecase/interfaces/agency-special-needs-master/update-agency-special-needs-master.interface";
import { UpdateAgencySpecialNeedsMasterUsecase } from "../../application/usecase/implementations/agency-special-needs-master/update-agency-special-needs-master.usecase";
import { IDeleteAgencySpecialNeedsMasterUsecase } from "../../application/usecase/interfaces/agency-special-needs-master/delete-agency-special-needs-master.interface";
import { DeleteAgencySpecialNeedsMasterUsecase } from "../../application/usecase/implementations/agency-special-needs-master/delete-agency-special-needs-master.usecase";
import { IListAgencySpecialNeedsMasterUsecase } from "../../application/usecase/interfaces/agency-special-needs-master/list-agency-special-needs-master.interface";
import { ListAgencySpecialNeedsMasterUsecase } from "../../application/usecase/implementations/agency-special-needs-master/list-agency-special-needs-master.usecase";
import { ICreateBookingCheckoutUseCase } from "../../application/usecase/interfaces/booking/create-booking-checkout.interface";
import { CreateBookingCheckoutUseCase } from "../../application/usecase/implementations/booking/create-booking-checkout.usecase";
import { IHandleStripeWebhookUsecase } from "../../application/usecase/interfaces/payment/handle-stripe-webhook-usecase.interface";
import { HandleStripeWebhookUsecase } from "../../application/usecase/implementations/payment/handle-stripe-webhook.usecase";
import { IGetPackageSpecialNeedsForBookingUseCase } from "../../application/usecase/interfaces/booking/get-package-special-needs-for-booking.interface";
import { GetPackageSpecialNeedsForBookingUseCase } from "../../application/usecase/implementations/booking/get-package-special-needs-for-booking.usecase";
import { IPreviewBookingPriceUseCase } from "../../application/usecase/interfaces/booking/preview-booking-price.interface";
import { PreviewBookingPriceUseCase } from "../../application/usecase/implementations/booking/preview-booking-price.usecase";
import { IGetAvailableCaretakersForBookingUseCase } from "../../application/usecase/interfaces/booking/get-available-caretakers-for-booking.interface";
import { GetAvailableCaretakersForBookingUseCase } from "../../application/usecase/implementations/booking/get-available-caretakers-for-booking.usecase";
import { IConfirmBookingSuccessUseCase } from "../../application/usecase/interfaces/booking/confirm-booking-success.interface";
import { ConfirmBookingSuccessUseCase } from "../../application/usecase/implementations/booking/confirm-booking-success.usecase";
import { IListClientBookingsUseCase } from "../../application/usecase/interfaces/booking/list-client-bookings.interface";
import { ListClientBookingsUseCase } from "../../application/usecase/implementations/booking/list-client-bookings.usecase";
import { IGetClientBookingDetailUseCase } from "../../application/usecase/interfaces/booking/get-client-booking-detail.interface";
import { GetClientBookingDetailUseCase } from "../../application/usecase/implementations/booking/get-client-booking-detail.usecase";
import { ICancelClientBookingUseCase } from "../../application/usecase/interfaces/booking/cancel-client-booking.interface";
import { CancelClientBookingUseCase } from "../../application/usecase/implementations/booking/cancel-client-booking.usecase";
import { ICreateCaretakerRequestUseCase } from "../../application/usecase/interfaces/caretaker-request/create-caretaker-request.interface";
import { CreateCaretakerRequestUseCase } from "../../application/usecase/implementations/caretaker-request/create-caretaker-request.usecase";
import { IListCaretakerRequestsUseCase } from "../../application/usecase/interfaces/caretaker-request/list-caretaker-requests.interface";
import { ListCaretakerRequestsUseCase } from "../../application/usecase/implementations/caretaker-request/list-caretaker-requests.usecase";
import { IFulfillCaretakerRequestUseCase } from "../../application/usecase/interfaces/caretaker-request/fulfill-caretaker-request.interface";
import { FulfillCaretakerRequestUseCase } from "../../application/usecase/implementations/caretaker-request/fulfill-caretaker-request.usecase";

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

    container.register<ISubmitCaretakerVerificationUsecase>("ISubmitCaretakerVerificationUsecase", {
      useClass: SubmitCaretakerVerificationUsecase,
    });

    container.register<IGetCaretakerProfileUsecase>("IGetCaretakerProfileUsecase", {
      useClass: GetCaretakerProfileUsecase,
    });

    // Forgot Password use cases
    container.register<IForgotPasswordUsecase>("IForgotPasswordUsecase", {
      useClass: ForgotPasswordUsecase,
    });

    container.register<IResetPasswordUsecase>("IResetPasswordUsecase", {
      useClass: ResetPasswordUsecase,
    });

    container.register<IVerifyResetTokenUsecase>("IVerifyResetTokenUsecase", {
      useClass: VerifyResetTokenUsecase,
    });
    container.register<IReverifyAgencyUsecase>("IReverifyAgencyUsecase", {
      useClass: ReverifyAgencyUsecase,
    });

    // Google Authentication use case
    container.register<IGoogleAuthUsecase>("IGoogleAuthUsecase", {
      useClass: GoogleAuthUsecase,
    });

    // Session / current user
    container.register<IGetCurrentUserUsecase>("IGetCurrentUserUsecase", {
      useClass: GetCurrentUserUsecase,
    });

    container.register<IGetUserProfileUsecase>(
      "IGetUserProfileUsecase",
      {
        useClass:GetUserProfileUsecase,
      }
    );

    container.register<IUpdateUserProfileUsecase>(
      "IUpdateUserProfileUsecase",
      {
        useClass: UpdateUserProfileUsecase,
      }
    );

    // Admin Agency use cases
    container.register<IGetAllAgenciesUsecase>("IGetAllAgenciesUsecase", {
      useClass: GetAllAgenciesUsecase,
    });

    container.register<IGetAgencyDetailsUsecase>("IGetAgencyDetailsUsecase", {
      useClass: GetAgencyDetailsUsecase,
    });

    container.register<IBlockUnblockAgencyUsecase>("IBlockUnblockAgencyUsecase", {
      useClass: BlockUnblockAgencyUsecase,
    });
    container.register<IVerifyAgencyUsecase>("IVerifyAgencyUsecase", {
      useClass: VerifyAgencyUsecase,
    });
    container.register<IRejectAgencyUsecase>("IRejectAgencyUsecase", {
      useClass: RejectAgencyUsecase,
    });

    // Agency Profile use cases
    container.register<IGetAgencyProfileUsecase>("IGetAgencyProfileUsecase", {
      useClass: GetAgencyProfileUsecase,
    });

    container.register<IUpdateAgencyProfileUsecase>("IUpdateAgencyProfileUsecase", {
      useClass: UpdateAgencyProfileUsecase,
    });

    // Package use cases
    container.register<ICreatePackageUsecase>("ICreatePackageUsecase", {
      useClass: CreatePackageUsecase,
    });

    container.register<IUpdatePackageUsecase>("IUpdatePackageUsecase", {
      useClass: UpdatePackageUsecase,
    });

    container.register<IPublishPackageUsecase>("IPublishPackageUsecase", {
      useClass: PublishPackageUsecase,
    });

    container.register<IGetAgencyPackagesUsecase>("IGetAgencyPackagesUsecase", {
      useClass: GetAgencyPackagesUsecase,
    });

    container.register<IGetPackageByIdUsecase>("IGetPackageByIdUsecase", {
      useClass: GetPackageByIdUsecase,
    });

    container.register<IUpdatePackageBasicUsecase>("IUpdatePackageBasicUsecase", {
      useClass: UpdatePackageBasicUsecase,
    });

    container.register<IUpdatePackageImagesUsecase>("IUpdatePackageImagesUsecase", {
      useClass: UpdatePackageImagesUsecase,
    });

    container.register<IUpdatePackageItineraryUsecase>("IUpdatePackageItineraryUsecase", {
      useClass: UpdatePackageItineraryUsecase,
    });

    container.register<IDeletePackageUsecase>("IDeletePackageUsecase", {
      useClass: DeletePackageUsecase,
    });

    container.register<ICompletePackageUsecase>("ICompletePackageUsecase", {
      useClass: CompletePackageUsecase,
    });

    container.register<ICancelPackageUsecase>("ICancelPackageUsecase", {
      useClass: CancelPackageUsecase,
    });

    container.register<ICreateActivityUsecase>("ICreateActivityUsecase", {
      useClass: CreateActivityUsecase,
    });

    container.register<IGetAllActivitiesUsecase>("IGetAllActivitiesUsecase", {
      useClass: GetAllActivitiesUsecase,
    });

    // Browse Packages use case
    container.register("IBrowsePackagesUsecase", {
      useClass: BrowsePackagesUsecase,
    });

    // Client-only: upcoming packages (startDate > today)
    container.register("IGetUpcomingClientPackagesUsecase", {
      useClass: GetUpcomingClientPackagesUsecase,
    });

    container.register("IUserController",{
       useClass:UserController,
    })
    container.register("IBlockedUserMiddleware",{
      useClass:BlockedUserMiddleware,
    })

    // Category use cases
    container.register("ICreateCategoryUsecase", {
      useClass: CreateCategoryUsecase,
    });

    container.register("IUpdateCategoryUsecase", {
      useClass: UpdateCategoryUsecase,
    });

    container.register("IDeleteCategoryUsecase", {
      useClass: DeleteCategoryUsecase,
    });

    container.register("IListCategoriesUsecase", {
      useClass: ListCategoriesUsecase,
    });

    container.register("IListActiveCategoriesUsecase", {
      useClass: ListActiveCategoriesUsecase,
    });

    // Wishlist use cases
    container.register<IAddToWishlistUsecase>("IAddToWishlistUsecase", {
      useClass: AddToWishlistUsecase,
    });

    container.register<IRemoveFromWishlistUsecase>("IRemoveFromWishlistUsecase", {
      useClass: RemoveFromWishlistUsecase,
    });

    container.register<IGetWishlistUsecase>("IGetWishlistUsecase", {
      useClass: GetWishlistUsecase,
    });

    container.register<ICheckWishlistStatusUsecase>("ICheckWishlistStatusUsecase", {
      useClass: CheckWishlistStatusUsecase,
    });

    // Special Needs Master use cases
    container.register<IListActiveSpecialNeedsMasterUsecase>("IListActiveSpecialNeedsMasterUsecase", {
      useClass: ListActiveSpecialNeedsMasterUsecase,
    });

    // Agency Special Needs use cases
    container.register<IEnableSpecialNeedUsecase>("IEnableSpecialNeedUsecase", {
      useClass: EnableSpecialNeedUsecase,
    });

    container.register<IUpdateSpecialNeedUsecase>("IUpdateSpecialNeedUsecase", {
      useClass: UpdateSpecialNeedUsecase,
    });

    container.register<IToggleActiveStatusUsecase>("IToggleActiveStatusUsecase", {
      useClass: ToggleActiveStatusUsecase,
    });

    container.register<ISoftDeleteSpecialNeedUsecase>("ISoftDeleteSpecialNeedUsecase", {
      useClass: SoftDeleteSpecialNeedUsecase,
    });

    container.register<IListAgencySpecialNeedsUsecase>("IListAgencySpecialNeedsUsecase", {
      useClass: ListAgencySpecialNeedsUsecase,
    });

    // Agency Special Needs Master use cases
    container.register<ICreateAgencySpecialNeedsMasterUsecase>("ICreateAgencySpecialNeedsMasterUsecase", {
      useClass: CreateAgencySpecialNeedsMasterUsecase,
    });

    container.register<IUpdateAgencySpecialNeedsMasterUsecase>("IUpdateAgencySpecialNeedsMasterUsecase", {
      useClass: UpdateAgencySpecialNeedsMasterUsecase,
    });

    container.register<IDeleteAgencySpecialNeedsMasterUsecase>("IDeleteAgencySpecialNeedsMasterUsecase", {
      useClass: DeleteAgencySpecialNeedsMasterUsecase,
    });

    container.register<IListAgencySpecialNeedsMasterUsecase>("IListAgencySpecialNeedsMasterUsecase", {
      useClass: ListAgencySpecialNeedsMasterUsecase,
    });

    container.register<ICreateBookingCheckoutUseCase>("ICreateBookingCheckoutUseCase", {
      useClass: CreateBookingCheckoutUseCase,
    });

    container.register<IHandleStripeWebhookUsecase>("IHandleStripeWebhookUsecase", {
      useClass: HandleStripeWebhookUsecase,
    });

    container.register<IGetPackageSpecialNeedsForBookingUseCase>("IGetPackageSpecialNeedsForBookingUseCase", {
      useClass: GetPackageSpecialNeedsForBookingUseCase,
    });
    container.register<IPreviewBookingPriceUseCase>("IPreviewBookingPriceUseCase", {
      useClass: PreviewBookingPriceUseCase,
    });
    container.register<IGetAvailableCaretakersForBookingUseCase>("IGetAvailableCaretakersForBookingUseCase", {
      useClass: GetAvailableCaretakersForBookingUseCase,
    });
    container.register<IConfirmBookingSuccessUseCase>("IConfirmBookingSuccessUseCase", {
      useClass: ConfirmBookingSuccessUseCase,
    });
    container.register<IListClientBookingsUseCase>("IListClientBookingsUseCase", {
      useClass: ListClientBookingsUseCase,
    });
    container.register<IGetClientBookingDetailUseCase>("IGetClientBookingDetailUseCase", {
      useClass: GetClientBookingDetailUseCase,
    });
    container.register<ICancelClientBookingUseCase>("ICancelClientBookingUseCase", {
      useClass: CancelClientBookingUseCase,
    });
    container.register<ICreateCaretakerRequestUseCase>("ICreateCaretakerRequestUseCase", {
      useClass: CreateCaretakerRequestUseCase,
    });
    container.register<IListCaretakerRequestsUseCase>("IListCaretakerRequestsUseCase", {
      useClass: ListCaretakerRequestsUseCase,
    });
    container.register<IFulfillCaretakerRequestUseCase>("IFulfillCaretakerRequestUseCase", {
      useClass: FulfillCaretakerRequestUseCase,
    });
  }
}
