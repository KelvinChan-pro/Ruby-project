module Tokenable
	def create_token_and_timestamp
		self.token =  SecureRandom.urlsafe_base64(nil, false)
		self.expire_at = Time.now + 24.hours
	end
end