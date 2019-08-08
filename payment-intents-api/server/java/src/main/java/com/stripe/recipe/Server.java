package com.stripe.recipe;

import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.staticFiles;
import static spark.Spark.port;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.annotations.SerializedName;

import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.exception.*;
import com.stripe.net.Webhook;

public class Server {
    private static Gson gson = new Gson();

    static class CreatePaymentBody {
        @SerializedName("currency")
        String currency;
        @SerializedName("amount")
        String amount;

        public String getCurrency() {
            return currency;
        }

        public String getAmount() {
            return amount;
        }
    }

    public static void main(String[] args) {
        port(4242);
        Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");

        staticFiles.externalLocation(
                Paths.get(Paths.get("").toAbsolutePath().getParent().getParent().toString() + "/client")
                        .toAbsolutePath().toString());

        get("/public-key", (request, response) -> {
            response.type("application/json");
            JsonObject publicKey = new JsonObject();
            publicKey.addProperty("publicKey", System.getenv("STRIPE_PUBLIC_KEY"));
            return publicKey.toString();
        });

        post("/payment_intents", (request, response) -> {
            response.type("application/json");

            CreatePaymentBody postBody = gson.fromJson(request.body(), CreatePaymentBody.class);
            Map<String, Object> paymentIntentParams = new HashMap<>();
            paymentIntentParams.put("amount", postBody.getAmount());
            paymentIntentParams.put("currency", postBody.getCurrency());
            PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams);
            return paymentIntent.toJson();
        });

        post("/webhook", (request, response) -> {
            String payload = request.body();
            String sigHeader = request.headers("Stripe-Signature");
            String endpointSecret = System.getenv("STRIPE_WEBHOOK_SECRET");

            Event event = null;

            try {
                event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            } catch (SignatureVerificationException e) {
                // Invalid signature
                response.status(400);
                return "";
            }

            switch (event.getType()) {
            case "payment_intent.succeeded":
                System.out.println("💰Your user provided payment details!");
                break;
            default:
                // Unexpected event type
                response.status(400);
                return "";
            }

            response.status(200);
            return "";
        });
    }
}