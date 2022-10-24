class BookingMailer < Mailer
	def self.send(email:, template:, params:, type: nil, path: nil)
		params[:action_url] = self.domain + (path || "/bookings/#{params[:id]}?type=#{type}")

    	PostmarkClient.deliver_with_template(
    		from: self.from,
    		to: email,
    		template_alias: template,
    		template_model: params
    	)
	end
end
