class Marina < ApplicationRecord
    validates :name, :address, :state, :city, :zip, presence: true
    belongs_to :user, required: false
    belongs_to :lake, required: true, class_name: 'Lake', foreign_key: 'lake_id'
    belongs_to :state_region, required: false, class_name: 'State', foreign_key: 'state_id'
    belongs_to :country, required: false, class_name: 'Country', foreign_key: 'country_id'
    has_many :boat_locations, dependent: :destroy
    has_many :boats, through: :boat_locations
    before_create :set_country
    before_update :set_state_region

    def to_index_res(count=nil)
        {
            id: self.id,
            name: self.name,
            lat: self.lat,
            lng: self.lng,
            address: self.address,
            city: self.city,
            state: self.state,
            zip: self.zip,
            address_query: address_query,
            lake: self.lake&.to_index_res || {},
            lake_name: self.lake&.name,
            approved: self.approved,
            boat_count: count || self.boats.count,
            full_name: full_name,
        }
    end

    def key
        self.name.downcase.gsub(' ', '_').gsub("'", '')
    end

    def lake_name
        self.lake.name
    end

    def full_name
        "#{self.name}, #{self.lake_name}"
    end

    def full_address
       "#{self.address || ''} #{self.address_two || ''} #{self.city || ''} #{self.state || ''} #{self.zip || ''}"
    end

    def address_query
        if self.address &&  self.city && self.state
            self.address + ', ' + self.city + ', ' + self.state
        end
    end

    def get_lat_and_lng
        file = YAML.load_file(Rails.root.join("config/marina_locations.yml"))
        ap self.lake.key
        ap key
        file[self.lake.key][key]
    end

    def set_lat_and_lng
        ll = get_lat_and_lng
        self.lat = ll["lat"]
        self.lng = ll["lng"]
        self.save
    end

    def reverse_geocode
        if self.lat && self.lng
            GmapsClient.reverse_geocode([self.lat, self.lng])
        end
    end

    def set_address_by_reverse_geocode
        g = reverse_geocode[0][:address_components]
        if g
            self.address = g[0][:long_name] + ' ' + g[1][:long_name]
            self.city = g[2][:long_name]
            self.state = g[4] && g[4][:short_name]
            self.zip = g[6] && g[6][:short_name]
            self.save
        end
    end

    def set_country
        self.country = Country.first
    end

    def set_state_region
        self.state_region = State.find_by(name: State::STATES[self.state&.to_sym])
    end

    def self.index
        Marina.all.map do |marina|
            marina.to_index_res
        end
    end

    def self.option_index
        Lake.where(approved: true).inject({}) do |meem, lake|
            marinas = lake.marinas.where(approved: true).order(:name).inject({}) do |mem, marina|
                mem[marina.id] = marina.name
                mem
            end
            meem[lake.id] = marinas
            meem
        end
    end

    def self.unapproved
        Marina.where(approved: false).map do |marina|
            marina.to_index_res
        end
    end

end
