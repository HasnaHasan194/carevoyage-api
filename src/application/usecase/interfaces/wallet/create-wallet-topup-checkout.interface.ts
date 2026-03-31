export interface CreateWalletTopupCheckoutResult {
  url: string;
  sessionId: string;
}

export interface ICreateWalletTopupCheckoutUseCase {
  execute(userId: string, amount: number): Promise<CreateWalletTopupCheckoutResult>;
}

