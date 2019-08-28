const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { resolve } = require("path");
const envPath = resolve("../../../.env");
const env = require("dotenv").config({ path: envPath });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 4242;

// Setup useful middleware.
app.use(
  bodyParser.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("../../client"));
app.use(express.json());

// Render the checkout page
app.get("/", (req, res) => {
  const path = resolve("./client/index.html");
  res.sendFile(path);
});

// Serve apple developer merchantid domain association
app.get(
  "/.well-known/apple-developer-merchantid-domain-association",
  (req, res) => {
    const path = resolve("./apple-developer-merchantid-domain-association");
    res.sendFile(path);
  }
);

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1999;
};

app.get("/public-key", (req, res) => {
  res.send({ publicKey: process.env.STRIPE_PUBLIC_KEY });
});

app.post("/payment_intents", async (req, res) => {
  let { currency, items } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency
    });
    return res.status(200).json(paymentIntent);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Render the charge completed page
app.get("/payment_intent_succeeded", (req, res) => {
  const path = resolve("./../../client/payment_succeeded.html");
  res.sendFile(path);
});

// A webhook to receive events sent from Stripe
// You can listen for specific events
// This webhook endpoint is listening for a payment_intent.succeeded event
app.post("/webhook", async (req, res) => {
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        env.parsed.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    console.log("💰Your user provided payment details!");
    // Fulfill any orders or e-mail receipts
    res.sendStatus(200);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
