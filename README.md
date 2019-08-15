# Stripe Elements modal demo

This project shows how to implement [Stripe Elements](https://stripe.com/payments/elements) within a modal dialog using the following APIs.
The folders for the below include a client and server examples.

- [Payment Intents API](https://stripe.com/docs/payments/payment-intents/quickstart#automatic-confirmation-flow) reference implementation with Payment Intents API in [the cards only folder](cards-only).

- [Payment Request API (i.e Apple Pay)](https://stripe.com/docs/stripe-js/elements/payment-request-button) reference implementation with PaymentIntents in [the cards and mobile wallets folder](cards-and-mobile-wallets).

#### Payment success

![Elements modal](cards-and-mobile-wallets/payment-request-3d-secure.gif)

#### Payment declined

![Elements modal payment declined](cards-and-mobile-wallets/payment-request-3d-secure-fail.gif)
