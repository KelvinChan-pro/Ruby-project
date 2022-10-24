class BoatDate < ApplicationRecord
	belongs_to :boat, required: false
	belongs_to :user
end
