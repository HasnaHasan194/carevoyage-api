import Stripe from "stripe";
export interface IPaymentService {
  createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>,
    product ?: {name : string;description : string;images ?: string[]}
  ): Promise<{ url: string; sessionId: string }>;


  verifyWebhookSignature(
    payload: Buffer,
    signature: string,
    endpointsecret: string
  ): Promise<Stripe.Event>;
}