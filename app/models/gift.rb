class Gift < ApplicationRecord
	validates :gift_type, :address, :city, :state, presence: true

	belongs_to :user

  	def to_res
  		{
  			id: self.id,
  			gift_type: self.gift_type,
  			size: self.size,
  			address: self.address,
        address_two: self.address_two,
  			city: self.city,
  			state: self.state,
        zip: self.zip,
        full_address: full_address,
        user: self.user.full_name,
        shipped: self.shipped,
  		}
  	end

    def full_address
       "#{self.address || ''} #{self.address_two || ''} #{self.city || ''} #{self.state || ''} #{self.zip || ''}"
    end

    def self.index
      Gift.all.map do |gift|
        gift.to_res
      end
    end
end
