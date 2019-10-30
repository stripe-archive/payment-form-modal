#! /usr/bin/env python3.6

"""
server.py
Stripe Recipe.
Python 3.6 or newer required.
"""

import stripe
import json
import os

from flask import Flask, render_template, jsonify, request, send_from_directory
from dotenv import load_dotenv, find_dotenv

static_dir = f'{os.path.abspath(os.path.join(__file__ ,"../../../client"))}'
app = Flask(__name__, static_folder=static_dir,
            static_url_path="", template_folder=static_dir)

# Setup Stripe python client library
load_dotenv(find_dotenv())
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
stripe.api_version = os.getenv('STRIPE_API_VERSION')


@app.route('/', methods=['GET'])
def get_setup_intent_page():
    return render_template('index.html')


@app.route('/public-key', methods=['GET'])
def get_publishable_key():
    return jsonify(publicKey=os.getenv('STRIPE_PUBLISHABLE_KEY'))


def calculate_order_amount(items):
    # Replace this constant with a calculation of the order's amount
    # Calculate the order total on the server to prevent
    # people from directly manipulating the amount on the client
    return 1999


@app.route('/payment_intents', methods=['POST'])
def create_payment_intent():
    # Reads application/json and returns a response
    data = json.loads(request.data)
    payment_intent = stripe.PaymentIntent.create(
        amount=calculate_order_amount(data['items']),
        currency=data['currency'],
    )
    return jsonify(payment_intent)


@app.route('/webhook', methods=['POST'])
def webhook_received():
    # You can use webhooks to receive information about asynchronous payment events.
    # For more about our webhook events check out https://stripe.com/docs/webhooks.
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    request_data = json.loads(request.data)

    if webhook_secret:
        # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
        signature = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload=request.data, sig_header=signature, secret=webhook_secret)
            data = event['data']
        except Exception as e:
            return e
        # Get the type of webhook event sent - used to check the status of PaymentIntents.
        event_type = event['type']
    else:
        data = request_data['data']
        event_type = request_data['type']
    data_object = data['object']

    if event_type == 'payment_intent.succeeded':
        print('🔔 Occurs when a new SetupIntent is created.')

    return jsonify({'status': 'success'})


if __name__ == '__main__':
    app.run(host="localhost", port=4242, debug=True)
