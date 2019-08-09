# Stripe Elements modal demo

This project shows how to implement [Stripe Elements](https://stripe.com/payments/elements) within a modal dialog using the following APIs.

- [Payment Intents API](https://stripe.com/docs/payments/payment-intents/quickstart#automatic-confirmation-flow) reference implementation with Payment Intents API in [this folder](payment-intents-api).

- [Payment Request API (i.e Apple Pay)](https://stripe.com/docs/stripe-js/elements/payment-request-button) reference implementation with PaymentIntents in [this folder](payment-request-api).

- [Charges API](https://stripe.com/docs/charges) reference implementation in [this folder](charges-api)

#### Payment success

![Elements modal](payment-request-api/payment-request-3d-secure.gif)

#### Payment declined

![Elements modal payment declined](payment-request-api/payment-request-3d-secure-fail.gif)
