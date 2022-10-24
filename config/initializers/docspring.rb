DocSpring.configure do |config|
	config.api_token_id = ENV['DOCSPRING_TOKEN_ID']
	config.api_token_secret = ENV['DOCSPRING_TOKEN_SECRET']
end

DocSpringClient = DocSpring::Client.new