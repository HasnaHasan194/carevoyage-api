import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { IHandleStripeWebhookUsecase } from "../../../application/usecase/interfaces/payment/handle-stripe-webhook-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { config } from "../../../shared/config";
import { ERROR_MESSAGE } from "../../../shared/constants/constants";

@injectable()
export class PaymentController {
  constructor(
    @inject("IHandleStripeWebhookUsecase")
    private readonly _handleStripeWebhookUsecase: IHandleStripeWebhookUsecase
  ) {}

  async stripeWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers["stripe-signature"];
    if (!signature || typeof signature !== "string") {
      ResponseHelper.error(
        res,
        "Missing Stripe signature",
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    const payload = req.body as Buffer;
    const webhookSecret = config.stripe.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      ResponseHelper.error(
        res,
        "Webhook secret not configured",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
      return;
    }

    try {
      await this._handleStripeWebhookUsecase.execute(
        payload,
        signature,
        webhookSecret
      );
    } catch {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.STRIPE.WEBHOOK_SIGNATURE_INVALID,
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    res.status(HTTP_STATUS.OK).send();
  }
}
