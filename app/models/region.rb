class Region < ApplicationRecord
	validates :name, uniqueness: true, presence: true
	has_many :marinas, dependent: :destroy
	has_many :boats, through: :marinas
	include PgSearch::Model
	pg_search_scope :search_by_title, against: :name, using: {
	                                                tsearch: { 
	                                                    prefix: true 
	                                                }
	                                            }

	def to_index_res
	    {
	        id: self.id,
	        lat: self.lat,
	        lng: self.lng,
	        name: self.name,
	        zoom: self.zoom,
	        approved: self.approved,
	        boat_count: boats.count,
	    }
	end

	def key
	    self.name.downcase.gsub(' ', '_').gsub("'", '')
	end

	def marina_index(ids=[])
	    m = []
	    self.marinas.where(approved: true).map do |marina|
	        bts = marina.boats.where(id: ids, public: true)
	        m.push(marina.to_index_res(bts.count)) if bts.count > 0
	    end
	    m
	end

	def self.index
	    self.all.map do |region|
	        region.to_index_res
	    end
	end

	def self.option_index
	    self.where(approved: true).order(:name).inject({}) do |mem, region|
	        mem[region.id] = region.name
	        mem
	    end
	end

	def self.unapproved
	    self.where(approved: false) do |region|
	        region.to_index_res
	    end
	end

	def self.search(term)
	    res = search_by_title(term).where(approved: true).limit(6)
	    res.map do |region|
	        region.to_index_res
	    end
	end
end
