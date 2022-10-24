class Review < ApplicationRecord
	belongs_to :booking
	belongs_to :user
	validates :message, :rating, presence: true
	validates :rating, numericality: { less_than_or_equal_to: 5 }
	validates :user, uniqueness: { scope: [ :booking, :host ], message: 'has already submitted a review.' } 

	def to_res
		{
			message: self.message,
			rating: self.rating,
			user: self.user.to_index_res,
			host: self.host,
			time: self.created_at,
		}
	end

end
