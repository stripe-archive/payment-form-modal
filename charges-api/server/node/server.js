const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { resolve } = require("path");
const envPath = resolve("../../../.env");
const env = require("dotenv").config({ path: envPath });
const stripe = require("stripe")(env.parsed.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("../../client"));
app.use(express.json());

// Render the checkout page
app.get("/", (request, response) => {
  const path = resolve("../client/index.html");
  response.sendFile(path);
});

// Render the checkout page
app.post("/charge", async (request, response) => {
  const path = resolve("./../../client/charge.html");
  let charge;
  try {
    charge = await stripe.charges.create({
      amount: request.body.amount,
      currency: request.body.currency,
      description: request.body.productName,
      source: request.body.stripeToken
    });
  } catch (err) {
    // https://stripe.com/docs/error-codes
    // Check the error type in err.type
    console.log(`Received a ${err.type} error from Stripe.`);
  }

  // Verify the charge succeeded
  if (charge.status === "succeeded") {
    console.log("Your charge was successful!", charge);
    response.sendFile(path);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
