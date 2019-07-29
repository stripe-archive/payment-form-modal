<?php
use Slim\Http\Request;
use Slim\Http\Response;
use Stripe\Stripe;

require 'vendor/autoload.php';

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
  
$app->get('/', function (Request $request, Response $response, array $args) {
  return $response->write(file_get_contents($request->getAttribute('staticDir') . '../../client/index.html'));
});

$app->get('/public-key', function (Request $request, Response $response, array $args) {
    $pub_key = getenv('STRIPE_PUBLIC_KEY');

    $response->getBody()->write("Hello, $pub_key");
    return $response;
});

$app->run();
