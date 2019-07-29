require 'stripe'
require 'sinatra'
require 'dotenv'

Dotenv.load(File.dirname(__FILE__) + '/../../.env')
Stripe.api_key = ENV['STRIPE_SECRET_KEY']

set :static, true
set :public_folder, File.join(File.dirname(__FILE__), '../../client/')
set :port, 4242

get '/' do
  content_type 'text/html'
  send_file File.join(settings.public_folder, 'index.html')
end

post '/charge' do
  charge = Stripe::Charge.create(
    amount: params['amount'],
    currency: params['currency'],
    source: params['stripeToken'], # obtained with Stripe.js
    description: params['description']
  )
  if charge['status'] == 'succeeded'
    puts charge
    send_file File.join(settings.public_folder, 'charge.html')
  end
end
