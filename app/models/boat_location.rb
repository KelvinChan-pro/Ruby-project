class BoatLocation < ApplicationRecord
	belongs_to :boat
	belongs_to :marina
	validates :marina, uniqueness: { scope: :boat } 

	def to_index_res
		{
			id: self.id,
			marina_id: self.marina.id,
			marina_name: self.marina.name,
			lake_id: self.marina.lake.id,
			lake_name: self.marina.lake.name,
			lat: self.marina.lat,
			lng: self.marina.lng,
			state: self.marina.state,
			city: self.marina.city,
			zip: self.marina.zip,
			address: self.marina.address,
		}
	end
end
