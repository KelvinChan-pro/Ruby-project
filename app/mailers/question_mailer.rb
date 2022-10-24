class QuestionMailer < Mailer
	def self.send(boat:, guest:, question:)
    	PostmarkClient.deliver_with_template(
    		from: self.from,
    		to: Rails.env === "production" ? "support@golakehop.com" : "ryan@stagezero.dev",
    		template_alias: "question",
    		template_model: {
                question: question,
    			guest_name: guest.full_name,
                guest_email: guest.email,
                host_name: boat.user.full_name,
                host_email: boat.user.email,
                boat_url: self.domain + '/boats/' + boat.id,
    		}
    	)
	end
	
end
