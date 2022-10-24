class OnboardMailer < Mailer
	def self.send(email:, name:, copy:)
    	PostmarkClient.deliver_with_template(
    		from: self.from,
    		to: email,
    		template_alias: "onboard-reminder",
    		template_model: {
    			name: name,
                copy: copy,
                action_url: self.domain + '/onboarding',
    		}
    	)
	end
	
end
