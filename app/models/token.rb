class Token < ApplicationRecord
	serialize :metadata, Hash
	before_create :create_key_and_timestamp

	def self.get(key)
		token = find_by(key: key)
		raise "token has expired" if !token || token.expires_at < Time.now
		token.metadata
	end

	def self.destroy(key)
		Token.find_by(key: key).destroy
	end

	private
	def create_key_and_timestamp
		self.key =  SecureRandom.urlsafe_base64(nil, false)
		self.expires_at = Time.now + 7.days
	end
end

