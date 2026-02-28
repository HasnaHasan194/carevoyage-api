export interface IApproveRefundUseCase {
  execute(agencyId: string, refundRequestId: string): Promise<void>;
}

