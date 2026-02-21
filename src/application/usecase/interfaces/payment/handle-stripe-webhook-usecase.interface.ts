export interface IHandleStripeWebhookUsecase {
  execute(
    payload: Buffer,
    signature: string,
    endpointSecret: string
  ): Promise<void>;
}
