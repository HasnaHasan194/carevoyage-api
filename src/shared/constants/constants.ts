//Gender constants
export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

//HTTP STATUS ENUMS
export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

//cookies names
export const COOKIES_NAMES = {
  REFRESH_TOKEN: "refresh_token",
  ACCESS_TOKEN: "access_token",
};

//ERROR MESSAGE CONSTANTS
export const ERROR_MESSAGE = {
  // General Errors
  GENERAL: {
    SERVER_ERROR: "Internal server error",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Access denied. You do not have permission to access this resource.",
    INVALID_REQUEST: "Invalid request",
    DB_SESSION_NOT_STARTED: "DB session not started",
  },

  // Authentication & Authorization Errors
  AUTHENTICATION: {
    SERVER_ERROR: "Internal server error",
    UNAUTHORIZED_ROLE: "Admin is not found",
    USER_REGISTRATION_FAILED: "User registration failed",
    USER_ID_OR_EMAIL_OR_ROLE_MISSING: "User id, email or role is missing",
    USER_ID_NOT_FOUND: "User Id not found",
    INVALID_USER_TYPE: "Invalid user type! Expect client or vendor",
    INVALID_ROLE_FOR_REGISTRATION: "Invalid role for client registration",
    USER_TYPE_AND_ID_REQUIRED: "User type and id are required",
    USER_BLOCKED: "Your account has been blocked. Please contact support.",
    ID_AND_STATUS_REQUIRED: "Id and status are required",
    FORBIDDEN: "Access denied. You do not have permission to access this resource.",
    
    // Email related
    EMAIL_NOT_FOUND: "Email doesn't exist",
    EMAIL_EXISTS: "Email already exists",
    EMAIL_REQUIRED: "Email is required",
    EMAIL_OR_PHONE_REQUIRED: "Email or phone required",
    EMAIL_AND_PHONE_REQUIRED: "Email and phone are required",
    EMAIL_ALREADY_REGISTERED_GOOGLE: "This email is already registered under a different role. Please use a different Google account",
    
    // Phone related
    PHONE_NUMBER_EXISTS: "Phone number already exists",
    ALTERNATE_PHONE_NUMBER_EXISTS: "Alternate phone number already exists",
    
    // Password related
    PASSWORD_AND_CONFIRM_PASSWORD_REQUIRED: "Password and confirm password is required",
    PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME: "Password and confirm password must be same",
    PASSWORD_INCORRECT: "Invalid credentials",
    
    // OTP related
    INVALID_OTP: "Invalid OTP",
    
    // Token related
    TOKEN_MISSING: "Authorization token is required",
    TOKEN_EXPIRED_REFRESH: "Token time out, Please login again",
    UNAUTHORIZED_ACCESS: "Unauthorized access",
    TOKEN_BLACK_LISTED: "Token is blacklisted",
    TOKEN_EXPIRED_ACCESS: "Access token expired",
    INVALID_TOKEN: "Invalid token",
    INVALID_RESET_TOKEN: "Invalid reset token",
    INVALID_OR_EXPIRED_RESET_TOKEN: "Invalid or expired reset token",
    INVALID_OR_EXPIRED_RESET_TOKEN_REQUEST_NEW: "Invalid or expired reset token. Please request a new password reset.",
    RESET_TOKEN_USED_OR_EXPIRED: "Reset token has already been used or expired",
    RESET_TOKEN_USED_OR_EXPIRED_REQUEST_NEW: "Reset token has already been used or expired. Please request a new password reset.",
    
    // Account type related
    INVALID_ACCOUNT_TYPE_NOT_CLIENT: "Invalid account type. This is not a client account.",
    INVALID_ACCOUNT_TYPE_NOT_CARETAKER: "Invalid account type. This is not a caretaker account.",
    INVALID_ACCOUNT_TYPE_NOT_AGENCY: "Not an agency account",
    
    // Google auth related
    GOOGLE_AUTH_ONLY_FOR_CLIENT: "Google authentication is only available for client accounts. Please use your regular login.",
    
    // Invite token related
    INVALID_INVITE_TOKEN_TYPE: "Invalid invite token type",
    INVALID_ROLE_IN_INVITE_TOKEN: "Invalid role in invite token",
    
    // User not authenticated
    USER_NOT_AUTHENTICATED: "User not authenticated",
  },

  // User Errors
  USER: {
    NOT_FOUND: "User not found",
    NOT_FOUND_AFTER_UPDATE: "User not found after update",
    ALREADY_EXISTS: "User already exists",
    PHONE_ALREADY_IN_USE: "Phone number is already in use",
    BLOCKED: "User blocked successfully",
    UNBLOCKED: "User unblocked successfully",
  },

  // Agency Errors
  AGENCY: {
    NOT_FOUND: "Agency not found",
    NOT_FOUND_FOR_USER: "Agency not found for this user",
    PROFILE_NOT_FOUND: "Agency profile not found",
    ACCOUNT_BLOCKED: "Agency account is blocked",
    REGISTRATION_REJECTED: "Your agency registration was not approved. Please contact support.",
    REGISTRATION_PENDING: "Your agency registration is pending approval. Please wait for admin verification.",
    REVERIFY_LINK_INVALID_OR_EXPIRED: "Invalid or expired reverification link. Please request a new one from the rejection email.",
    REGISTRATION_NUMBER_EXISTS: "Registration number already exists",
    NOT_PENDING: "Agency is not pending approval. Only agencies with pending status can be approved or rejected.",
  },

  // Package Errors
  PACKAGE: {
    NOT_FOUND: "Package not found",
    MUST_HAVE_ITINERARY_BEFORE_PUBLISHING: "Package must have an itinerary before publishing",
    ALREADY_PUBLISHED: "Package is already published",
    CANNOT_EDIT_STATUS: (status: string) => `Cannot edit packages with status "${status}". Only draft and published packages can be edited.`,
    ONLY_DRAFT_CAN_BE_DELETED: "Only draft packages can be deleted. Published packages cannot be deleted.",
    CANNOT_CANCEL_STATUS: (status: string) => `Cannot cancel package with status "${status}". Only published packages can be cancelled.`,
    CANNOT_COMPLETE_STATUS: (status: string) => `Cannot complete package with status "${status}". Only published packages can be completed.`,
    CANNOT_COMPLETE_BEFORE_TRIP_END: "Cannot complete package before the trip end date",
    CANNOT_PUBLISH_STATUS: (status: string) => `Cannot publish package with status: ${status}`,
    ITINERARY_NOT_FOUND: "Itinerary not found for this package",
    ACTIVITIES_NOT_FOUND_OR_NOT_BELONG: "One or more existing activities not found or do not belong to this package",
    ACTIVITIES_NOT_FOUND: "One or more activities not found",
    ACTIVITY_NOT_FOUND_IN_CREATED: (name: string) => `Activity "${name}" not found in created activities`,
    FAILED_TO_UPDATE_WITH_ITINERARY: "Failed to update package with itinerary",
    AT_LEAST_ONE_IMAGE_REQUIRED: "At least one image must exist (existing or newly uploaded)",
    INVALID_CATEGORY: "Category must be one of: Sightseeing, Adventure, Cultural, Spiritual, Wellness, Family, Honeymoon, Nature, Heritage",
    MIN_PRICE_GREATER_THAN_MAX: "minPrice cannot be greater than maxPrice",
    MIN_DURATION_GREATER_THAN_MAX: "minDuration cannot be greater than maxDuration",
    START_DATE_AFTER_END_DATE: "startDate cannot be after endDate",
    INVALID_SORT_BY: (fields: string) => `sortBy must be one of: ${fields}`,
    ITINERARY_MUST_HAVE_AT_LEAST_ONE_DAY: "Itinerary must have at least one day",
    END_DATE_MUST_BE_AFTER_START: "End date must be after start date",
  },

  // Caretaker Errors
  CARETAKER: {
    PROFILE_NOT_FOUND: "Caretaker profile not found",
    PROFILE_NOT_FOUND_CONTACT_SUPPORT: "Caretaker profile not found. Please contact support.",
    NO_PENDING_INVITATION: "No pending invitation found. Please request a new invitation.",
    NO_PENDING_INVITATION_FOR_EMAIL_AND_AGENCY: "No pending invitation found for this email and agency",
    INVITATION_ALREADY_SENT: "Invitation already sent to this email",
    ALREADY_REGISTERED: "Caretaker already registered with this email",
    AGE_MUST_BE_18: "Age must be at least 18 years",
    PROFILE_NOT_ACTIVE: "Your caretaker profile is not active. Please contact your agency or support.",
  },

  // Admin Errors
  ADMIN: {
    NOT_FOUND: "Admin not found",
  },

  // AWS/S3 Errors
  AWS: {
    CREDENTIALS_NOT_CONFIGURED: "AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY",
    INVALID_S3_URL_FORMAT: "Invalid S3 URL format",
  },

  // Wishlist Errors
  WISHLIST: {
    ALREADY_IN_WISHLIST: "Package is already in your bucket list",
    NOT_IN_WISHLIST: "Package is not in your bucket list",
    PACKAGE_NOT_PUBLISHED: "Only published packages can be added to bucket list",
    PACKAGE_CANCELLED: "Cancelled packages cannot be added to bucket list",
    PACKAGE_NOT_FOUND: "Package not found",
  },

  // Booking Errors
  BOOKING: {
    NOT_FOUND: "Booking not found",
    ALREADY_EXISTS: "Booking already exists",
    INVALID_STATUS: "Invalid booking status",
    CANNOT_CANCEL: "Cannot cancel this booking",
  },

  // Wallet Errors
  WALLET: {
    NOT_FOUND: "Wallet not found",
    INSUFFICIENT_BALANCE: "Insufficient wallet balance",
    INVALID_AMOUNT: "Invalid amount",
  },

  // Review Errors
  REVIEW: {
    NOT_FOUND: "Review not found",
    ALREADY_EXISTS: "You have already reviewed this package",
    CANNOT_REVIEW_OWN: "Cannot review your own package",
  },

  // Stripe / Payment Errors
  STRIPE: {
    PAYMENT_ERROR: "Payment session could not be created",
    WEBHOOK_SIGNATURE_INVALID: "Invalid webhook signature",
  },
};

//SUCCESS MESSAGE CONSTANTS
export const SUCCESS_MESSAGE = {
  // Authorization Success
  AUTHORIZATION: {
    ACCOUNT_CREATED: "Account created successfully",
    LOGIN_SUCCESS: "Logged in successfully",
    LOGOUT_SUCCESS: "Logout successfully!",
    OTP_RESENT_SUCCESS: "OTP resend successfully",
    OTP_SEND_SUCCESS: "OTP send successfully",
    OTP_VERIFIED: "OTP verified successfully",
    PASSWORD_RESET_SUCCESS: "Password reset successfully",
    PASSWORD_RESET_EMAIL_SENT: "Password reset email sent successfully",
    NOT_BLOCKED: "User is not blocked. Middleware passed",
  },

  // User Success
  USER: {
    PROFILE_UPDATED: "Profile updated successfully",
    STATUS_UPDATED: "User status updated",
    BLOCKED: "User blocked successfully",
    UNBLOCKED: "User unblocked successfully",
    FETCHED: "User fetched successfully",
    USERS_FETCHED: "Users fetched successfully",
  },

  // Agency Success
  AGENCY: {
    PROFILE_UPDATED: "Agency profile updated successfully",
    FETCHED: "Agency fetched successfully",
    AGENCIES_FETCHED: "Agencies fetched successfully",
    STATUS_UPDATED: "Agency status updated",
    BLOCKED: "Agency blocked successfully",
    UNBLOCKED: "Agency unblocked successfully",
    VERIFIED: "Agency approved successfully",
    REJECTED: "Agency rejected successfully",
    REVERIFY_SUBMITTED: "Reverification request submitted. Your agency will be reviewed again by our team.",
  },

  // Package Success
  PACKAGE: {
    CREATED: "Package created successfully",
    UPDATED: "Package updated successfully",
    PUBLISHED: "Package published successfully",
    RETRIEVED: "Package retrieved successfully",
    PACKAGES_RETRIEVED: "Packages retrieved successfully",
    BASIC_DETAILS_UPDATED: "Package basic details updated successfully",
    IMAGES_UPDATED: "Package images updated successfully",
    ITINERARY_UPDATED: "Package itinerary updated successfully",
    DELETED: "Package deleted successfully",
    COMPLETED: "Package marked as completed",
    CANCELLED: "Package cancelled successfully",
  },

  // Caretaker Success
  CARETAKER: {
    PROFILE_CREATED: "Caretaker profile created successfully",
    PROFILE_UPDATED: "Caretaker profile updated successfully",
    PROFILE_FETCHED: "Caretaker profile fetched successfully",
    INVITATION_SENT: "Invitation sent successfully",
    VERIFICATION_SUBMITTED: "Verification submitted successfully",
    VERIFICATION_STATUS_UPDATED: "Verification status updated successfully",
  },

  // Admin Success
  ADMIN: {
    DASHBOARD_FETCHED: "Dashboard data fetched successfully",
  },

  // Booking Success
  BOOKING: {
    CREATED: "Booking created successfully",
    UPDATED: "Booking updated successfully",
    CANCELLED: "Booking cancelled successfully",
    FETCHED: "Booking fetched successfully",
    BOOKINGS_FETCHED: "Bookings fetched successfully",
  },

  // Wishlist Success
  WISHLIST: {
    ADDED: "Package added to bucket list successfully",
    REMOVED: "Package removed from bucket list successfully",
    FETCHED: "Bucket list fetched successfully",
  },

  // Review Success
  REVIEW: {
    CREATED: "Review created successfully",
    UPDATED: "Review updated successfully",
    DELETED: "Review deleted successfully",
    FETCHED: "Reviews fetched successfully",
  },

  // Wallet Success
  WALLET: {
    BALANCE_FETCHED: "Wallet balance fetched successfully",
    TRANSACTION_SUCCESS: "Transaction completed successfully",
    TRANSACTIONS_FETCHED: "Transactions fetched successfully",
  },
};

export const ROLES = {
  ADMIN: "admin",
  USER: "client",
  AGENCY: "vendor",
  CARETAKER: "guide",
} as const;

export const STATUS = {
  VERIFIED: "verified",
  PENDING: "pending",
  REVIEWING: "reviewing",
  REJECTED: "rejected",
} as const;

export const VERIFICATION_STATUS = {
  PENDING: "pending",
  REVIEWING: "reviewing",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export const EVENT_EMMITER_TYPE = {
  SENDMAIL: "SENDMAIL",
};

export enum MAIL_CONTENT_PURPOSE {
  LOGIN = "login",
  OTP = "otp",
}
