class State < Region
	include States
	has_many :marinas, dependent: :destroy
	has_many :boats, through: :marinas

	def self.create_all
		STATES.each do |code, name|
			State.create!(name: name)
		end
	end
end
