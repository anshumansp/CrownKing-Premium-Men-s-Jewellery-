const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency = "inr") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      payment_method_types: ["card", "upi"],
      metadata: {
        integration_check: "accept_a_payment",
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

const createUPIPaymentIntent = async (amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "inr",
      payment_method_types: ["upi"],
      metadata: {
        integration_check: "accept_a_payment",
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating UPI payment intent:", error);
    throw error;
  }
};

const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

const createRefund = async (paymentIntentId, amount) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
    });
    return refund;
  } catch (error) {
    console.error("Error creating refund:", error);
    throw error;
  }
};

module.exports = {
  createPaymentIntent,
  createUPIPaymentIntent,
  confirmPayment,
  createRefund,
};
