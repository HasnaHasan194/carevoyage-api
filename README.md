# CareVoyage API

## Stripe webhooks (local + staging/prod)

This API processes Stripe webhook events at:

- `POST /api/v1/payments/webhook`

The webhook handler validates the Stripe signature using `STRIPE_WEBHOOK_SECRET` from `.env`.

### Local development (localhost)

Stripe cannot send webhooks directly to `localhost`. Use the Stripe CLI to forward events:

```bash
stripe listen --forward-to http://localhost:3000/api/v1/payments/webhook
```

The CLI prints a signing secret like `whsec_...`. Put that value in:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart the backend after changing `.env`.

### Staging/Production

In Stripe Dashboard → Developers → Webhooks:

- Create/Update the endpoint to your public URL, e.g. `https://<your-domain>/api/v1/payments/webhook`
- Copy the signing secret into `STRIPE_WEBHOOK_SECRET` for that environment.

