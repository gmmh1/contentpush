import { Router } from "express";
import Stripe from "stripe";
import { auth } from "../middleware/auth";
import { config } from "../config";

export const billingRouter = Router();

const stripe = config.stripeSecretKey
  ? new Stripe(config.stripeSecretKey, { apiVersion: "2024-06-20" })
  : null;

billingRouter.post("/checkout-session", auth, async (_req, res) => {
  if (!stripe || !config.stripePriceId) {
    return res.status(400).json({ error: "Stripe not configured" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: config.stripePriceId, quantity: 1 }],
    success_url: `${config.appUrl}/billing?success=1`,
    cancel_url: `${config.appUrl}/billing?canceled=1`
  });

  return res.json({ url: session.url });
});
