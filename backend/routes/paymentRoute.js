const express = require("express");
const {
    processPayment,
    sendStripeApiKey,
    sendPaytmApiKey, // Assuming you might use Paytm as mentioned in dependencies
} = require("../controllers/paymentController"); // Will be created next

const { isAuthenticatedUser } = require("../middleware/auth"); // Will be created soon

const router = express.Router();

// Route to get the Stripe Publishable Key (used by the frontend)
router.route("/payment/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

// Route to process a payment with Stripe
router.route("/payment/process").post(isAuthenticatedUser, processPayment);

// Optional: If using Paytm, route to get the Paytm key (or similar integration)
router.route("/payment/paytmapikey").get(isAuthenticatedUser, sendPaytmApiKey);

module.exports = router;