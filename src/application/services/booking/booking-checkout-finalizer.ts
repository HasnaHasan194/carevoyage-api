import type { ClientSession } from "mongoose";
import type { IBookingCheckoutDraftRepository } from "../../../domain/repositoryInterfaces/BookingCheckoutDraft/booking-checkout-draft.repository.interface";
import type { IBookingRepository } from "../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import type { IDBSession } from "../../../infrastructure/interface/session.interface";
import type { ICreditBookingPayoutUseCase } from "../../usecase/interfaces/wallet/credit-booking-payout.interface";
import type { IChatConversationProvisioner } from "../chat/chat-conversation-provisioner";
import type { NotificationService } from "../notification/notification.service";
import { generateBookingId } from "../../../shared/utils/booking-id";

export async function finalizeBookingFromCheckoutDraft(params: {
  checkoutDraftId?: string;
  stripeSessionId?: string;
  bookingCheckoutDraftRepository: IBookingCheckoutDraftRepository;
  bookingRepository: IBookingRepository;
  caretakerProfileRepository: ICaretakerProfileRepository;
  agencyRepository: IAgencyRepository;
  dbSession: IDBSession;
  creditBookingPayoutUseCase: ICreditBookingPayoutUseCase;
  chatConversationProvisioner: IChatConversationProvisioner;
  notificationService: NotificationService;
}): Promise<void> {
  const {
    checkoutDraftId,
    stripeSessionId,
    bookingCheckoutDraftRepository,
    bookingRepository,
    caretakerProfileRepository,
    agencyRepository,
    dbSession,
    creditBookingPayoutUseCase,
    chatConversationProvisioner,
    notificationService,
  } = params;

  const draft = checkoutDraftId
    ? await bookingCheckoutDraftRepository.findById(checkoutDraftId)
    : stripeSessionId
      ? await bookingCheckoutDraftRepository.findByStripeSessionId(stripeSessionId)
      : null;

  if (!draft) return;
  if (draft.status !== "PENDING") return;

  const sessionId = stripeSessionId ?? draft.stripeSessionId;
  if (!sessionId) return;

  // Idempotency: if booking already exists for this Stripe session, do nothing.
  const existing = await bookingRepository.findByStripeSessionId(sessionId);
  if (existing) {
    await bookingCheckoutDraftRepository.updateById(draft._id, { status: "COMPLETED" });
    return;
  }

  let createdBookingId: string | null = null;

  await dbSession.withTransaction(async () => {
    const session = dbSession.getSession() as ClientSession;

    let created = null as Awaited<ReturnType<typeof bookingRepository.save>> | null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        created = await bookingRepository.save(
          {
            bookingId: generateBookingId(),
            clientId: draft.clientId,
            packageId: draft.packageId,
            agencyId: draft.agencyId,
            startDate: draft.startDate,
            basePrice: draft.basePrice,
            caretakerFee: draft.caretakerFee,
            specialNeedsFee: draft.specialNeedsFee,
            totalAmount: draft.totalAmount,
            currency: draft.currency,
            status: "CONFIRMED",
            stripeSessionId: sessionId,
            paidAt: new Date(),
            caretakerId: draft.caretakerId,
            selectedSpecialNeedIds: draft.selectedSpecialNeedIds,
          },
          session
        );
        break;
      } catch (err) {
        // Retry on duplicate bookingId collisions.
        const msg = err instanceof Error ? err.message : String(err);
        const code = (err as { code?: number })?.code;
        const isDuplicateKey =
          code === 11000 || msg.toLowerCase().includes("e11000");
        if (!isDuplicateKey || attempt === 4) throw err;
      }
    }
    if (!created) return;

    createdBookingId = created._id;

    await bookingCheckoutDraftRepository.updateById(
      draft._id,
      { status: "COMPLETED" },
      session
    );

    if (draft.caretakerId) {
      await caretakerProfileRepository.updateAvailabilityStatus(
        draft.caretakerId,
        "BUSY"
      );
    }

    await creditBookingPayoutUseCase.execute(
      {
        bookingId: created._id,
        agencyId: created.agencyId,
        totalAmount: created.totalAmount,
      },
      session
    );
  });

  if (!createdBookingId) return;

  const booking = await bookingRepository.findById(createdBookingId);
  if (!booking) return;

  // Post-commit side effects (non-transactional).
  await chatConversationProvisioner.provisionForBooking(booking);

  const agency = await agencyRepository.findById(booking.agencyId);
  if (agency) {
    await notificationService.createAndPublish({
      recipientUserId: agency.userId,
      recipientRole: "agency_owner",
      type: "BOOKING_CONFIRMED",
      title: "New booking confirmed",
      message: "A booking has been confirmed and paid.",
      link: "/agency/packages",
      metadata: { type: "BOOKING_CONFIRMED", bookingId: booking._id },
    });
  }

  await notificationService.createAndPublish({
    recipientUserId: booking.clientId,
    recipientRole: "client",
    type: "BOOKING_CONFIRMED",
    title: "Booking confirmed",
    message: "Your booking payment was successful and the booking is confirmed.",
    link: `/client/bookings/${booking._id}`,
    metadata: { type: "BOOKING_CONFIRMED", bookingId: booking._id },
  });

  if (booking.caretakerId) {
    const caretakerProfile = await caretakerProfileRepository.findById(
      booking.caretakerId
    );
    if (caretakerProfile?.userId) {
      await notificationService.createAndPublish({
        recipientUserId: caretakerProfile.userId,
        recipientRole: "caretaker",
        type: "BOOKING_CONFIRMED",
        title: "New trip assigned",
        message: "A booking you’re assigned to is confirmed.",
        link: "/caretaker/trips",
        metadata: { type: "BOOKING_CONFIRMED", bookingId: booking._id },
      });
    }
  }
}

