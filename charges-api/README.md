# Stripe Elements modal demo

This demo shows how to implement [Stripe Elements](https://stripe.com/payments/elements) within a modal dialog.

- [Payment Intents API](https://stripe.com/docs/payments/payment-intents/quickstart#automatic-confirmation-flow) reference implementation is in [this folder](../payment-intents-api).

- [Payment Request API (i.e Apple Pay)](https://stripe.com/docs/stripe-js/elements/payment-request-button) reference implementation with PaymentIntents is in [this folder](../payment-request-api).

![Elements modal](elements-modal-demo.gif)

## Run the demo

This project includes an example Express server that serves the `/client` folder and hosts an endpoint to create a charge with the [Charges API](https://stripe.com/docs/charges).

- Edit the `client/elementsModal.js` and add your public Stripe key on [line 4](client/elementsModal.js#L4).
- When the payment form submits, your server will need an endpoint to accept a Stripe token and create charges. This project includes an Express server with a default endpoint of `/charges`, defined on [134
  ](client/elementsModal.js#L134).

You can customize the payment form further to meet your needs. For example, you can change the footer text on [line 426](client/elementsModal.js#L426).

### Copy the env file, install the dependencies, and start the server:

```
# Add your Stripe API keys to your .env
cp .env.example .env
cd server/node
npm install
npm start
```

Go to [http://localhost:5000](http://localhost:5000) to see the payment page and create a test charge.

## Add this to your site

Want to get started right away and add this to your own site? Download a ZIP file of this project and add the CSS and JavaScript to your page's source.

### 1. Download the project [ZIP file](https://git.corp.stripe.com/ctrudeau/elements-modal-demo/archive/master.zip)

This Elements modal demo uses one CSS and one JS file (feel free to customize them to your needs.) You must also include the [meta tag](https://stripe.com/docs/stripe-js/elements/quickstart#viewport-meta-requirements) for
Stripe Elements support and the [StripeJS](https://stripe.com/docs/stripe-js/elements/quickstart#setup) library. Include them in the `<head>` of your page source:

```
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="elementsModal.css">
<script src="https://js.stripe.com/v3/"></script>
<script src="elementsModal.js"></script>
```

### 2. Create the Elements modal

You can create the modal by providing a few options

```
window.elementsModal.create({
  amount: 1999,
  currency: "USD",
  businessName: "KAVHOLM",
  productName: "Chair",
  customerEmail: "me@kavholm.com",
});
```

Here are the options the demo allows you to configure:

| Name                      | Description                                                                                                                                                                       | Type    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| amount (required)         | All API requests expect amounts to be provided in currency's smallest unit ([zero-decimal currencies](https://stripe.com/docs/currencies#zero-decimal) are handled in this demo.) | integer |
| currency (required)       | A [supported currency](https://stripe.com/docs/currencies#presentment-currencies)                                                                                                 | string  |
| businessName (required)   | Business name                                                                                                                                                                     | string  |
| productName (optional)    | Name of the product                                                                                                                                                               | string  |
| customer email (optional) | Customer email to display                                                                                                                                                         | string  |

### 3. Show the Elements modal

You can call `elementsModal.toggleElementsModalVisibility()` or use a button:

```
<button onClick="window.elementsModal.show();">
  Click here to trigger the Elements popup modal
</button>
```

### 4. Update the Form submit action

Currently when the user clicks the Pay button a POST request to "/charge" happens.
Update the [Form action](client/elementsModal.js#L132)
to hit your own servers Stripe Charge API. The form is submitted on [line 527](client/elementsModal.js#L527).

---

### A short example using this demo:

```

<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="elementsModal.css" />
    <script src="https://js.stripe.com/v3/"></script>
    <script src="elementsModal.js"></script>
  </head>
  <body>
    <div class="pay-button-wrapper">
      <button class="pay-button" onClick="elementsModal.toggleElementsModalVisibility();">
        Open Elements popup
      </button>
    </div>
  </body>

  <script>
    window.elementsModal.create({
      amount: 1999,
      currency: "USD",
      businessName: "KAVHOLM",
      productName: "Chair",
      customerEmail: "me@kavholm.com"
    });
  </script>
</html>
```
