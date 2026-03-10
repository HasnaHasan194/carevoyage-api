import { inject, injectable } from "tsyringe";
import type { IListChatConversationsUseCase } from "../../usecase/interfaces/chat/list-chat-conversations.interface";
import type { IChatRepository } from "../../../domain/repositoryInterfaces/Chat/chat.repository.interface";
import type { IBookingRepository } from "../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IUserRepository } from "../../../domain/repositoryInterfaces/User/user.repository.interface";
import type { IPackageRepository } from "../../../domain/repositoryInterfaces/Package/package.repository.interface";
import type { IChatConversationEntity } from "../../../domain/entities/chat-conversation.entity";

@injectable()
export class ListChatConversationsUseCase implements IListChatConversationsUseCase {
  constructor(
    @inject("IChatRepository")
    private readonly _chatRepository: IChatRepository,
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository
  ) {}

  async execute(
    userId: string,
    role: "client" | "caretaker",
    limit?: number
  ): Promise<(IChatConversationEntity & { otherPartyName?: string; packageName?: string })[]> {
    const conversations = await this._chatRepository.listConversations({
      userId,
      role,
      limit,
    });

    if (!conversations.length) {
      return conversations;
    }

    const bookingIds = conversations.map((c) => c.bookingId);
    const bookings = await Promise.all(
      bookingIds.map((id) => this._bookingRepository.findById(id))
    );

    const bookingById = new Map<string, NonNullable<(typeof bookings)[number]>>();
    const clientIds = new Set<string>();
    const caretakerProfileIds = new Set<string>();
    const packageIds = new Set<string>();

    bookings.forEach((b) => {
      if (!b) return;
      bookingById.set(b._id, b);
      clientIds.add(b.clientId);
      if (b.caretakerId) {
        caretakerProfileIds.add(b.caretakerId);
      }
      packageIds.add(b.packageId);
    });

    const [clients, caretakerProfiles, packages] = await Promise.all([
      Promise.all(Array.from(clientIds).map((id) => this._userRepository.findById(id))),
      Promise.all(
        Array.from(caretakerProfileIds).map((id) =>
          this._caretakerProfileRepository.findById(id)
        )
      ),
      Promise.all(Array.from(packageIds).map((id) => this._packageRepository.findById(id))),
    ]);

    const userById = new Map<string, NonNullable<(typeof clients)[number]>>();
    clients.forEach((u) => {
      if (u) userById.set(u._id, u);
    });

    const caretakerProfileById = new Map<
      string,
      NonNullable<(typeof caretakerProfiles)[number]>
    >();
    caretakerProfiles.forEach((p) => {
      if (p) caretakerProfileById.set(p._id, p);
    });

    const packageById = new Map<string, NonNullable<(typeof packages)[number]>>();
    packages.forEach((p) => {
      if (p) packageById.set(p._id, p);
    });

    const enriched = conversations.map((c) => {
      const booking = bookingById.get(c.bookingId);
      if (!booking) return c;

      const pkg = packageById.get(booking.packageId);
      const packageName = pkg?.PackageName ?? "Trip";

      let otherPartyName: string | undefined;

      if (role === "caretaker") {
        const client = userById.get(booking.clientId);
        if (client) {
          const fullName = `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim();
          otherPartyName = fullName || client.email || "Client";
        } else {
          otherPartyName = "Client";
        }
      } else if (role === "client" && booking.caretakerId) {
        const profile = caretakerProfileById.get(booking.caretakerId);
        if (profile) {
          let caretakerName: string | undefined = profile.email ?? "Caretaker";
          if (profile.userId) {
            const caretakerUser = userById.get(profile.userId);
            if (caretakerUser) {
              const fullName = `${caretakerUser.firstName ?? ""} ${
                caretakerUser.lastName ?? ""
              }`.trim();
              caretakerName = fullName || caretakerUser.email || caretakerName;
            }
          }
          otherPartyName = caretakerName;
        } else {
          otherPartyName = "Caretaker";
        }
      }

      return {
        ...c,
        otherPartyName,
        packageName,
      };
    });

    return enriched;
  }
}

