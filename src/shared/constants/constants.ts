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
    RETRIEVED:"Users retrieved successfully"
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
    CANNOT_EDIT_DATES_WHEN_PUBLISHED:
      "You cannot change the start or end date of a published package.",
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
    NOT_FOUND_FOR_AGENCY: "Caretaker not found for this agency",
    CANNOT_UPDATE_DELETED: "Cannot update a deleted caretaker",
    CANNOT_CHANGE_BUSY_AVAILABILITY:
      "Cannot change availability of a busy caretaker",
    INVALID_AVAILABILITY_STATUS: "Invalid availability status",
    INVALID_PRICE_PER_DAY:
      "Price per day must be greater than or equal to 0",
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
    PACKAGE_START_DATE_NOT_UPCOMING:
      "Only packages with a future start date can be added to bucket list",
  },

  // Booking Errors
  BOOKING: {
    NOT_FOUND: "Booking not found",
    ALREADY_EXISTS: "Booking already exists",
    INVALID_STATUS: "Invalid booking status",
    CANNOT_CANCEL: "Cannot cancel this booking",
    ANOTHER_BOOKING_ON_THIS_DATE: (packageName: string) =>
      `You have the booking for ${packageName} on this date`,
    ONLY_PUBLISHED_CAN_BE_BOOKED: "Only published packages can be booked",
    CARETAKER_NOT_FOUND: "Caretaker not found",
    CARETAKER_NOT_ACTIVE: "Caretaker is not active",
    CARETAKER_NOT_AVAILABLE: "Caretaker is not available",
    TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO:
      "Total amount must be greater than 0",
  },

  // Caretaker Request Errors
  CARETAKER_REQUEST: {
    NOT_FOUND: "Caretaker request not found",
    NOT_PENDING: "Request is no longer pending",
    NOT_AGENCY_REQUEST: "Request does not belong to this agency",
  },

  // Upload Errors
  UPLOAD: {
    NO_FILE_UPLOADED: "No file uploaded",
    NO_FILES_UPLOADED: "No files uploaded",
    S3_KEY_REQUIRED: "S3 key is required",
    S3_KEYS_REQUIRED: "Array of S3 keys is required",
    PROFILE_UPLOAD_FAILED: "Failed to upload profile image",
    DOCUMENTS_UPLOAD_FAILED: "Failed to upload documents",
    SIGNED_URL_FAILED: "Failed to generate signed URL",
    SIGNED_URLS_FAILED: "Failed to generate signed URLs",
  },

  // Wallet Errors
  WALLET: {
    NOT_FOUND: "Wallet not found",
    INSUFFICIENT_BALANCE: "Insufficient wallet balance",
    INVALID_AMOUNT: "Invalid amount",
    UNSUPPORTED_ROLE: "Wallet is not available for this role",
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
  REFUND: {
    NOT_FOUND: "Refund request not found",
    NOT_AGENCY_REQUEST: "Refund request does not belong to this agency",
    ALREADY_REQUESTED: "Refund already requested for this booking",
    NOT_ELIGIBLE: "No refund eligible for this booking",
  },

  CATEGORY: {
    NOT_FOUND: "Category not found",
  },

  SPECIAL_NEEDS: {
    CONFIG_NOT_FOUND: "Special need configuration not found",
    CONFIG_ALREADY_DELETED: "Special need configuration is already deleted",
    CANNOT_TOGGLE_DELETED_CONFIG:
      "Cannot toggle status of a deleted special need configuration",
    NOT_FOUND: "Special need not found",
    NOT_AVAILABLE: "This special need is not available",
    CANNOT_UPDATE_DELETED:
      "Cannot update a deleted special need or configuration",
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
    ACCESS_TOKEN_REFRESHED: "Access token refreshed successfully",
    RESET_TOKEN_VALID: "Reset token is valid",
    INVITE_TOKEN_VERIFIED: "Invite token verified successfully",
    CURRENT_USER_FETCHED: "Current user retrieved successfully",
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
    UPCOMING_LIST_FETCHED: "Upcoming packages retrieved successfully",
    ACTIVITY_CREATED:"Activity created successfully",
    ACTIVITY_RETRIEVED:"Activity retrieved successfully"
  },

  // Caretaker Success
  CARETAKER: {
    PROFILE_CREATED: "Caretaker profile created successfully",
    PROFILE_UPDATED: "Caretaker profile updated successfully",
    PROFILE_FETCHED: "Caretaker profile fetched successfully",
    INVITATION_SENT: "Invitation sent successfully",
    VERIFICATION_SUBMITTED: "Verification submitted successfully",
    VERIFICATION_STATUS_UPDATED: "Verification status updated successfully",
    VERIFICATION_STATUS_FETCHED: "Verification status retrieved successfully",
    LIST_FETCHED: "Caretakers fetched",
    AVAILABLE_LIST_FETCHED: "Available caretakers retrieved",
    AVAILABILITY_UPDATED: "Caretaker availability updated",
    REMOVED: "Caretaker removed",
    PRICE_UPDATED: "Caretaker price updated",
  },

  // Upload Success
  UPLOAD: {
    PROFILE_IMAGE_UPLOADED: "Profile image uploaded successfully",
    DOCUMENTS_UPLOADED: "Documents uploaded successfully",
    SIGNED_URL_GENERATED: "Signed URL generated successfully",
    SIGNED_URLS_GENERATED: "Signed URLs generated successfully",
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
    DETAIL_FETCHED: "Booking detail retrieved",
    CHECKOUT_CREATED: "Checkout session created",
    PRICE_PREVIEW: "Price preview",
    CONFIRMED: "Booking confirmed",
    LIST_FETCHED_FOR_CLIENT: "Bookings retrieved",
    DETAIL_FETCHED_FOR_CLIENT: "Booking detail retrieved",
    CANCELLED_BY_CLIENT: "Booking cancelled",
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
  // Caretaker Request Success
  CARETAKER_REQUEST: {
    LIST_FETCHED: "Caretaker requests retrieved",
    FULFILLED: "Request fulfilled. Client has been notified.",
    CREATED: "Caretaker request sent. The agency will be notified.",
  },
  // Refund Success
  REFUND: {
    LIST_FETCHED: "Refund requests retrieved",
    APPROVED: "Refund approved",
    REJECTED: "Refund rejected",
    REQUESTED_BY_CLIENT: "Refund request submitted",
  },

  SPECIAL_NEEDS: {
    MASTER_CREATED: "Special need created successfully",
    MASTER_UPDATED: "Special need updated successfully",
    MASTER_DELETED: "Special need deleted successfully",
    MASTER_LIST_FETCHED: "Special needs retrieved successfully",
    MASTER_ACTIVE_LIST_FETCHED: "Active special needs retrieved successfully",
    FETCHED_FOR_BOOKING: "Special needs retrieved",
  },

  AGENCY_SPECIAL_NEEDS: {
    ENABLED: "Special need enabled successfully",
    UPDATED: "Special need updated successfully",
    STATUS_UPDATED: "Special need status updated successfully",
    DELETED: "Special need deleted successfully",
    LIST_FETCHED: "Special needs retrieved successfully",
  },

  CATEGORY: {
    CREATED: "Category created successfully",
    UPDATED: "Category updated successfully",
    DELETED: "Category deleted successfully",
    LIST_FETCHED: "Categories retrieved successfully",
    ACTIVE_LIST_FETCHED: "Active categories retrieved successfully",
  },
};

// VALIDATION MESSAGE CONSTANTS (for class-validator decorators)
export const VALIDATION_MESSAGE = {
  GENERAL: {
    REQUIRED: (field: string) => `${field} is required`,
    MUST_BE_STRING: (field: string) => `${field} must be a string`,
    MUST_BE_NUMBER: (field: string) => `${field} must be a number`,
    MUST_BE_BOOLEAN: (field: string) => `${field} must be a boolean value`,
    MIN_LENGTH: (field: string, min: number) =>
      `${field} must be at least ${min} characters`,
    MAX_LENGTH: (field: string, max: number) =>
      `${field} must not exceed ${max} characters`,
    MUST_BE_IN_LIST: (field: string, values: string) =>
      `${field} must be one of: ${values}`,
    ARRAY_MIN_SIZE: (field: string, min: number) =>
      `${field} must contain at least ${min} item${min > 1 ? "s" : ""}`,
  },

  ID: {
    MUST_BE_MONGODB_ID: (field: string) =>
      `${field} must be a valid MongoDB ObjectId`,
  },

  PACKAGE: {
    ID_REQUIRED: "Package ID is required",
    ID_MUST_BE_OBJECT_ID: "Package ID must be a valid MongoDB ObjectId",
    NAME_REQUIRED: "Package name is required",
    DESCRIPTION_REQUIRED: "Description is required",
    CATEGORY_REQUIRED: "Category is required",
    MEETING_POINT_REQUIRED: "Meeting point is required",
    AT_LEAST_ONE_IMAGE: "At least one image is required",
    AT_LEAST_ONE_ITINERARY_DAY: "At least one itinerary day is required",
  },

  BOOKING: {
    PACKAGE_ID_REQUIRED: "Package ID is required",
  },

  CATEGORY: {
    NAME_REQUIRED: "Category name is required",
  },

  SPECIAL_NEEDS: {
    NAME_REQUIRED: "Special need name is required",
    ID_REQUIRED: "Special need ID is required",
  },
} as const;

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
