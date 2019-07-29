package com.stripe.recipe;

import java.util.HashMap;
import java.util.Map;
import java.nio.file.Paths;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import com.stripe.Stripe;
import com.stripe.model.Charge;

public class Server {
    public static void main(String[] args) {
        Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");

        staticFiles.externalLocation(
                Paths.get(Paths.get("").toAbsolutePath().getParent().getParent().toString() + "/client")
                        .toAbsolutePath().toString());

        get("/", (request, response) -> {
            return "hello from server";
        });

        post("/charge", (request, response) -> {
            response.type("application/json");
            Map<String, Object> chargeParams = new HashMap<String, Object>();
            chargeParams.put("amount", request.queryParams("amount"));
            chargeParams.put("currency", request.queryParams("currency"));
            chargeParams.put("description", request.queryParams("description"));
            chargeParams.put("source", request.queryParams("stripeToken"));
            // ^ obtained with Stripe.js
            Charge charge = Charge.create(chargeParams);
            System.out.println(charge.toString());
            response.redirect("charge.html");
            return null;
        });

    }
}