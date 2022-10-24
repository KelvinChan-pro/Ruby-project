class PasswordReset < ApplicationRecord
	belongs_to :user
	include Tokenable
	before_create :create_token_and_timestamp
	after_create :send_email

	def send_email
		ResetPasswordMailer.send(
			name: self.user.first_name,
			email: self.user.email,
			token: self.token
		)
	end
end
