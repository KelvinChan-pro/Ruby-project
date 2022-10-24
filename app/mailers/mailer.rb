class Mailer
	private

	def self.domain
		ENV["DOMAIN"]
	end

	def self.from
		"hi@golakehop.com"
	end
end