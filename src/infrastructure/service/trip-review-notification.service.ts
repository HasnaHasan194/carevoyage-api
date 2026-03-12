import { injectable } from "tsyringe";
import { eventBus } from "../../shared/eventBus";
import { config } from "../../shared/config";
import { EVENT_EMMITER_TYPE, MAIL_CONTENT_PURPOSE } from "../../shared/constants/constants";
import { mailContentProvider } from "../../shared/mailContentProvider";
import type {
  ITripReviewNotificationService,
  TripReviewInviteContext,
} from "../../domain/service-interfaces/trip-review-notification-service.interface";

@injectable()
export class TripReviewNotificationService implements ITripReviewNotificationService {
  async sendTripReviewInvite(context: TripReviewInviteContext): Promise<void> {
    const reviewUrlBase =
      config.client.URI && config.client.URI.trim().length > 0
        ? config.client.URI.replace(/\/$/, "")
        : "http://localhost:5173";

    const reviewUrl = `${reviewUrlBase}/client/reviews/new?bookingId=${context.bookingId}`;

    eventBus.emit(
      EVENT_EMMITER_TYPE.SENDMAIL,
      context.clientEmail,
      "How was your recent CareVoyage trip?",
      mailContentProvider(MAIL_CONTENT_PURPOSE.TRIP_REVIEW_INVITE, {
        clientName: context.clientFirstName,
        packageName: context.packageName,
        reviewUrl,
      })
    );
  }
}

