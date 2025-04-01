const express = require("express");
const router = express.Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { AppError, ErrorTypes } = require("../utils/AppError");

// Create payment intent
router.post("/create-payment-intent", async (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || !paymentMethod) {
      throw new AppError(
        "Amount and payment method are required",
        400,
        ErrorTypes.VALIDATION_ERROR
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "inr",
      payment_method_types: [paymentMethod],
      metadata: {
        orderId: req.body.orderId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

// Webhook handler for Stripe events
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new AppError(
        "Webhook signature verification failed",
        400,
        ErrorTypes.VALIDATION_ERROR
      );
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          // Handle successful payment
          // Update order status, send confirmation email, etc.
          break;
        case "payment_intent.payment_failed":
          // Handle failed payment
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
