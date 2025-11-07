const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with secret key

// ======================================================================
// 1. Send Stripe Publishable Key to Frontend
// ======================================================================

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
    // The frontend needs the publishable key to interact with Stripe securely.
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

// ======================================================================
// 2. Process Payment using Stripe
// ======================================================================

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount, // Amount must be sent in the request body
        currency: "inr", // Use your desired currency (e.g., usd, bdt, inr)
        metadata: {
            company: "HaatBazarEcommerce",
        },
    });

    res.status(200).json({
        success: true,
        // The clientSecret is sent back to the frontend to finalize the payment
        client_secret: paymentIntent.client_secret,
    });
});

// ======================================================================
// 3. Send Paytm Key (Placeholder)
// ======================================================================

// You would implement similar logic here if you decide to fully integrate Paytm.
exports.sendPaytmApiKey = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        // For Paytm, you might send the MID, MKEY, and website info
        paytmApiKey: process.env.PAYTM_MERCHANT_KEY,
    });
});