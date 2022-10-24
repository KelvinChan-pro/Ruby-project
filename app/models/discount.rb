class Discount < ApplicationRecord
	belongs_to :user

	def to_res
		{
			id: self.id,
			admin: user.full_name,
			percentage: self.percentage,
			amount: self.amount,
			dollar_amount: self.dollar_amount,
			string: string,
			code: self.code,
		}
	end

	def self.index
		Discount.all.map do |discount|
			discount.to_res
		end
	end

	def string
		if self.dollar_amount
			n_to_s(self.amount)
		else
			strip_trailing_zero(self.percentage * 100) + '%'
		end
	end

	private

	def strip_trailing_zero(n)
  		n.to_s.sub(/\.?0+$/, '')
	end

	def n_to_s(n, with_dollar: true)
		(with_dollar ? '$' : '') + n.to_s.reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
	end
end
