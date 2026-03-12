export interface TripReviewInviteContext {
  bookingId: string;
  clientId: string;
  clientEmail: string;
  clientFirstName: string;
  packageName: string;
}

export interface ITripReviewNotificationService {
  sendTripReviewInvite(context: TripReviewInviteContext): Promise<void>;
}

