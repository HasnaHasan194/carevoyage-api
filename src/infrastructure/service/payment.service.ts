import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../domain/errors/customError";
import { IPaymentService } from "../../domain/service-interfaces/payment-service.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants/constants";

@injectable()
export class StripePaymentService implements IPaymentService {
  constructor(
    @inject("Stripe")
    private _stripe: Stripe
  ) {}

  async createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>,
    product?: { name: string; description?: string; images?: string[] }
  ): Promise<{ url: string; sessionId: string }> {
    const session = await this._stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: product?.name ?? "Travel Package",
              description: product?.description ?? undefined,
              images: product?.images?.length ? product.images : undefined,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata ?? undefined,
    });

    if (!session.url) {
      throw new CustomError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGE.STRIPE.PAYMENT_ERROR
      );
    }

    return { sessionId: session.id, url: session.url };
  }

  async verifyWebhookSignature(
    payload: Buffer,
    signature: string,
    endpointSecret: string
  ): Promise<Stripe.Event> {
    return this._stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret
    );
  }
}
