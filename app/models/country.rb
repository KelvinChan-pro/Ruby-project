class Country < Region
	has_many :marinas, dependent: :destroy
	has_many :boats, through: :marinas
end
