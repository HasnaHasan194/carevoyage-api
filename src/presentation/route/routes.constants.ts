export const ROUTES = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    AGENCY_SIGNUP: "/agency/signup",
    AGENCY_LOGIN: "/agency/login",
    ADMIN_LOGIN: "/admin/login",
    SEND_OTP: "/send-otp",
    RESEND_OTP: "/resend-otp",
    VERIFY_OTP: "/verify-otp",
    VERIFY_CREATE_USER: "/verify-createuser",
    VERIFY_CREATE_AGENCY: "/verify-create-agency",
    LOGOUT: "/logout",
    REFRESH_TOKEN: "/refresh-token",
    VERIFY_CARETAKER_INVITE: "/verify-caretaker-invite",
    CARETAKER_SIGNUP: "/caretaker/signup",
    CARETAKER_LOGIN: "/caretaker/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_RESET_TOKEN: "/verify-reset-token",
    AGENCY_REVERIFY: "/agency/reverify",
    GOOGLE_AUTH: "/google",
    ME: "/me",
  },

  AGENCY: {
    PROFILE: "/profile",
    CARETAKERS_INVITE: "/caretakers/invite",
    CARETAKERS_LIST: "/caretakers",
    CARETAKER_STATUS: "/caretakers/:caretakerId/status",
    CARETAKER_PRICE: "/caretakers/:caretakerId/price",
    CARETAKER_DELETE: "/caretakers/:caretakerId",
    CARETAKER_REQUESTS: "/caretaker-requests",
    CARETAKER_REQUEST_FULFILL: "/caretaker-requests/:requestId/fulfill",
    REFUND_REQUESTS: "/refund-requests",
    REFUND_REQUEST_APPROVE: "/refund-requests/:requestId/approve",
    REFUND_REQUEST_REJECT: "/refund-requests/:requestId/reject",
    BOOKING_DETAIL: "/bookings/:bookingId",
    PACKAGES_BASE: "/packages",
    PACKAGE_DETAIL: "/packages/:packageId",
    PACKAGE_BOOKINGS: "/packages/:packageId/bookings",
    PACKAGE_UPDATE: "/packages/:packageId",
    PACKAGE_BASIC: "/packages/:packageId/basic",
    PACKAGE_IMAGES: "/packages/:packageId/images",
    PACKAGE_ITINERARY: "/packages/:packageId/itinerary",
    PACKAGE_PUBLISH: "/packages/:packageId/publish",
    PACKAGE_DELETE: "/packages/:packageId",
    PACKAGE_COMPLETE: "/packages/:packageId/complete",
    PACKAGE_CANCEL: "/packages/:packageId/cancel",
    ACTIVITIES_BASE: "/activities",
    UPLOAD_PROFILE_IMAGE: "/upload/profile-image",
    UPLOAD_IMAGE: "/upload/image",
    UPLOAD_IMAGES: "/upload/images",
    SALES_REPORT: "/sales-report",
    SALES_REPORT_PDF: "/sales-report/pdf",
    SALES_REPORT_EXCEL: "/sales-report/excel",
    REVIEWS: "/reviews",
  },

  AGENCY_CATEGORY: {
    BASE: "/categories",
    DETAIL: "/categories/:id",
    ACTIVE: "/categories/active",
  },

  AGENCY_SPECIAL_NEEDS: {
    BASE: "/special-needs",
    DETAIL: "/special-needs/:id",
    TOGGLE_ACTIVE: "/special-needs/:id/toggle-active",
  },

  AGENCY_SPECIAL_NEEDS_MASTER: {
    BASE: "/special-needs-master",
    DETAIL: "/special-needs-master/:id",
    ACTIVE: "/special-needs-master/active",
  },

  PACKAGE_PUBLIC: {
    ROOT: "/",
    UPCOMING: "/upcoming",
  },

  BOOKING: {
    CHECKOUT: "/checkout",
    PACKAGE_SPECIAL_NEEDS: "/package/:packageId/special-needs",
    PRICE_PREVIEW: "/price-preview",
    PACKAGE_CARETAKERS: "/package/:packageId/caretakers",
    CONFIRM_SUCCESS: "/confirm-success",
    CARETAKER_REQUEST: "/caretaker-request",
    MY_BOOKINGS: "/my",
    DETAIL: "/:bookingId",
    CANCEL: "/:bookingId/cancel",
    REFUND_REQUEST: "/:bookingId/refund-request",
  },

  USER: {
    PROFILE: "/profile",
    UPLOAD_PROFILE_IMAGE: "/upload/profile-image",
    UPLOAD_DOCUMENTS: "/upload/documents",
    SIGNED_URL: "/signed-url",
    SIGNED_URLS: "/signed-urls",
    WISHLIST_BASE: "/wishlist",
    WISHLIST_DETAIL: "/wishlist/:packageId",
    WISHLIST_STATUS: "/wishlist/:packageId/status",
    AGENCY_REVIEWS: "/agency-reviews",
  },

  WALLET: {
    ME: "/me",
    ME_TRANSACTIONS: "/me/transactions",
  },

  ADMIN: {
    USERS: "/users",
    USER_DETAIL: "/users/:userId",
    USER_BLOCK: "/users/:userId/block",
    USER_UNBLOCK: "/users/:userId/unblock",
    AGENCIES: "/agencies",
    AGENCY_DETAIL: "/agencies/:agencyId",
    AGENCY_BLOCK: "/agencies/:agencyId/block",
    AGENCY_UNBLOCK: "/agencies/:agencyId/unblock",
    AGENCY_VERIFY: "/agencies/:agencyId/verify",
    AGENCY_REJECT: "/agencies/:agencyId/reject",
    WALLET_TRANSACTIONS: "/wallet-transactions",
    SALES_REPORT: "/sales-report",
    SALES_REPORT_PDF: "/sales-report/pdf",
    SALES_REPORT_EXCEL: "/sales-report/excel",
  },

  CARETAKER: {
    UPLOAD_DOCUMENTS: "/upload/documents",
    VERIFICATION: "/verification",
    VERIFICATION_STATUS: "/verification/status",
    PROFILE: "/profile",
    DASHBOARD: "/dashboard",
    TRIPS: "/trips",
  },

  CHAT: {
    CONVERSATIONS: "/conversations",
    BOOKING_MESSAGES: "/bookings/:bookingId/messages",
  },
} as const;

export const API_PREFIX = "/api/v1";

export const API_MOUNTS = {
  AUTH: `${API_PREFIX}/auth`,
  ADMIN: `${API_PREFIX}/admin`,
  AGENCY: `${API_PREFIX}/agency`,
  USER: `${API_PREFIX}/user`,
  CARETAKER: `${API_PREFIX}/caretaker`,
  PACKAGES: `${API_PREFIX}/packages`,
  BOOKING: `${API_PREFIX}/booking`,
  CHAT: `${API_PREFIX}/chat`,
  WALLETS: `${API_PREFIX}/wallets`,
  PAYMENT_WEBHOOK: `${API_PREFIX}/payments/webhook`,
} as const;

