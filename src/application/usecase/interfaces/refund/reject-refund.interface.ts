export interface IRejectRefundUseCase {
  execute(
    agencyId: string,
    refundRequestId: string,
    reason?: string
  ): Promise<void>;
}

