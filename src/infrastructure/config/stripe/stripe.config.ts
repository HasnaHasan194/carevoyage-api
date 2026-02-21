import Stripe from "stripe";
import { config } from "../../../shared/config";

export const stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY!);
