class ResetPasswordMailer < Mailer
	def self.send(email:, name:, token:)
    	PostmarkClient.deliver_with_template(
    		from: self.from,
    		to: email,
    		template_alias: "password-reset",
    		template_model: {
    			name: name,
    			action_url: domain + "/change_password/#{token}", 
    		}
    	)
	end
	
end
