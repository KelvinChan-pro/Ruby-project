module Moneyable
	def to_usd(number)
		num_groups = number.to_i.to_s.chars.to_a.reverse.each_slice(3)
  		'$' + num_groups.map(&:join).join(',').reverse
	end
end