import type { IRefundRequestEntity } from "../../../../domain/entities/refund-request.entity";

export interface IRequestRefundUseCase {
  execute(userId: string, bookingId: string): Promise<IRefundRequestEntity>;
}

