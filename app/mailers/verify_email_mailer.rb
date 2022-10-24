class VerifyEmailMailer < Mailer
	def self.send(email:, name:, token:, account_type:)
    	PostmarkClient.deliver_with_template(
    		from: self.from,
    		to: email,
    		template_alias: "verify-email",
    		template_model: {
    			name: name,
                account_type: account_type,
    			action_url: domain + "/verify_email/#{token}", 
    		}
    	)
	end
	
end
