class BackgroundCheckMailer < Mailer
	def self.send(name:, pdf:)
    	PostmarkClient.deliver_with_template(
    		from: self.from,
    		to: Rails.env === "production" ? "support@golakehop.com" : "ryan@stagezero.dev",
    		template_alias: "background-check",
    		template_model: {
    			name: name,
    		},
            Attachments: [
                {
                  Name: "#{name}-background-check.pdf",
                  Content: pdf,
                  ContentType: "application/octet-stream"
                }
            ]
    	)
	end
	
end
