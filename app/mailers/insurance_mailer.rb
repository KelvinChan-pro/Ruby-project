class InsuranceMailer < Mailer
    def self.send(name:, blob:)
        blob.open do |file|
            file = Base64.encode64(file.read)
            PostmarkClient.deliver_with_template(
                from: self.from,
                to: Rails.env === "production" ? "support@golakehop.com" : "ryan@stagezero.dev",
                template_alias: "insurance",
                template_model: {
                    name: name,
                },
                Attachments: [
                    {
                      Name: "#{name}-insurance",
                      Content: file,
                      ContentType: blob.content_type
                    }
                ]
            )
        end
    end
end