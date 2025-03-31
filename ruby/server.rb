require 'sinatra'
require 'cowsay'

port = ENV["PORT"] || "8080"
configure { 
  set :server, :puma
  set :bind, '0.0.0.0'
  set :port, port
}

get '/health' do
  content_type "text/plain"
  "Healthy"
end


get '/liveness' do
  content_type "text/plain"
  "Live"
end

get '/readiness' do
  content_type "text/plain"
  "Ready"
end

get '/remote' do
  content_type "application/json"
  require 'net/http'
  require 'json'
  url = ENV["REMOTE_URL"] || "http://localhost:8080"
  uri = URI(url)
  response = Net::HTTP.get(uri)
  response
end

get '/healthy' do
  content_type "text/plain"
  "Hello World!"
end

get '/bad' do
  content_type "text/plain"
  status 500
  "Error occurred"
end

get '/random-error' do
  content_type "text/plain"
  if rand(1..2) == 1
    status 500
    "Error occurred"
  else
    "Hello World!"
  end
end

get '/' do
  content_type "text/plain"
  "Hello World!"
end
