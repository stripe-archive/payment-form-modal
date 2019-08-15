<?php
use Slim\Http\Request;
use Slim\Http\Response;
use Stripe\Stripe;

require 'vendor/autoload.php';

if (PHP_SAPI == 'cli-server') {
  $_SERVER['SCRIPT_NAME'] = '/index.php';
}

$dotenv = Dotenv\Dotenv::create(realpath('../../..'));
$dotenv->load();

$app = new \Slim\App;

// Instantiate the logger as a dependency
$container = $app->getContainer();
$container['logger'] = function ($c) {
  $settings = $c->get('settings')['logger'];
  $logger = new Monolog\Logger($settings['name']);
  $logger->pushProcessor(new Monolog\Processor\UidProcessor());
  $logger->pushHandler(new Monolog\Handler\StreamHandler(__DIR__ . '/logs/app.log', \Monolog\Logger::DEBUG));
  return $logger;
};

$app->add(function ($request, $response, $next) {
    Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));
    return $next($request, $response);
});
$app->get('/elementsModal.css', function (Request $request, Response $response, array $args) { 
  return $response->withHeader('Content-Type', 'text/css')->write(file_get_contents('../../client/elementsModal.css'));
});
$app->get('/demo.css', function (Request $request, Response $response, array $args) { 
  return $response->withHeader('Content-Type', 'text/css')->write(file_get_contents('../../client/demo.css'));
});
$app->get('/elementsModal.js', function (Request $request, Response $response, array $args) { 
  return $response->withHeader('Content-Type', 'text/javascript')->write(file_get_contents('../../client/elementsModal.js'));
});
$app->get('/product.png', function (Request $request, Response $response, array $args) { 
  return $response->withHeader('Content-Type', 'image/png')->write(file_get_contents('../../client/product.png'));
});

$app->get('/', function (Request $request, Response $response, array $args) {   
  // Display checkout page
  return $response->write(file_get_contents('../../client/index.html'));
});

$app->get('/public-key', function (Request $request, Response $response, array $args) {
  $pub_key = getenv('STRIPE_PUBLIC_KEY');
  
  // Send public key details to client
  return $response->withJson(array('publicKey' => $pub_key));
});


function calculateOrderAmount($items)
{
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1999;
}

$app->post('/payment_intents', function (Request $request, Response $response, array $args) {  
  $body = json_decode($request->getBody());  
  $paymentIntent = \Stripe\PaymentIntent::create([
    "amount" => calculateOrderAmount($body->items),
    "currency" => $body->currency,
  ]);
  // Send Payment Intent details to client
  return $response->withJson($paymentIntent);
});

$app->post('/webhook', function(Request $request, Response $response) {
    $logger = $this->get('logger');
    $event = $request->getParsedBody();
    // Parse the message body (and check the signature if possible)
    $webhookSecret = getenv('STRIPE_WEBHOOK_SECRET');
    if ($webhookSecret) {
      try {
        $event = \Stripe\Webhook::constructEvent(
          $request->getBody(),
          $request->getHeaderLine('stripe-signature'),
          $webhookSecret
        );
      } catch (\Exception $e) {
        return $response->withJson([ 'error' => $e->getMessage() ])->withStatus(403);
      }
    } else {
      $event = $request->getParsedBody();
    }
    $type = $event['type'];
    $object = $event['data']['object'];
    
    if ($type == 'payment_intent.succeeded') {
      $logger->info('💰Your user provided payment details!');
    }

    return $response->withJson([ 'status' => 'success' ])->withStatus(200);
});

$app->run();