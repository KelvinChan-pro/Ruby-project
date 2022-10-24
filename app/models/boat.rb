class Boat < ApplicationRecord
	include ActiveStorageSupport::SupportForBase64
	include PgSearch::Model
	pg_search_scope :search_by_host, associated_against: {
    	user: [:first_name, :last_name]
  	}
	has_one_base64_attached :insurance
	has_one_base64_attached :cover_photo
	has_one_base64_attached :preview_photo_1
	has_one_base64_attached :preview_photo_2
	has_one_base64_attached :misc_photo_1
	has_one_base64_attached :misc_photo_2
	has_one_base64_attached :misc_photo_3
	has_one_base64_attached :misc_photo_4
	has_one_base64_attached :misc_photo_5
	has_one_base64_attached :misc_photo_6
    has_many_base64_attached :miscellaneous_photos # legacy

	belongs_to :user
    belongs_to :marina, required: false
	has_many :boat_dates, dependent: :destroy
	has_many :boat_locations, dependent: :destroy
	has_many :marinas, through: :boat_locations
	has_many :bookings, dependent: :destroy
	has_many :bookmarks, dependent: :destroy
	
	validates :boat_type, :make, :model, :year, :guest_count, presence: true, if: :not_pro_hopper?
	serialize :sub_activities, Hash
	serialize :features, Hash
	serialize :navigation, Hash
	serialize :rules, Hash
	serialize :time_increments, Hash
    serialize :extra_features, Array
    serialize :extra_navigation, Array
    serialize :extra_rules, Hash

    # delegate :weekday_start, :weekday_end, :weekend_start, :weekend_end, :available_weekends, :available_weekdays, to: :user


    def not_pro_hopper?
    	!self.pro_hopper
    end

	def to_index_res
		{
            id: self.id,
            boat_type: self.boat_type,
            locations: location_index,
            user: self.user.full_name,
            user_id: self.user_id,
            email: self.user.email,
            insurance: insurance_url,
            insurance_file_name: self.insurance_file_name,
            completed: self.user.onboard_completed,
            created: self.created_at.to_date,
            onboard_steps_completed: self.user.onboard_metadata.keys.count,
            custom_cancellation_policy: self.custom_cancellation_policy,
        }
	end

	def to_search_index(bbs=[])
		{
			id: self.id,
			cover_photo: cover_photo_url,
			preview_photo_1: preview_photo_1_url,
			preview_photo_2: preview_photo_2_url,
			activities: {
				fishing: self.fishing,
				leisure: self.leisure,
				watersports: self.watersports,
				celebrity: self.celebrity,
			},
			pro_hopper: self.pro_hopper,
			price: self.price,
			time_increments: self.time_increments,
			title: self.title,
			description: self.description,
			user: self.user.to_index_res,
			guest_count: self.guest_count,
			review_meta: review_meta,
			bookmarked: bbs.include?(self.id),
			lake_name: self.lake&.name,
			rental: self.rental,
			locations: location_index,
		}
	end

	def to_show_res(current_user=nil)
		bbs = current_user&.bookmarked_boats&.pluck(:id) || []
		{
			id: self.id,
			boat_type: self.boat_type,
			make: self.make,
			model: self.model,
			year: self.year,
			length: self.length,
			guest_count: self.guest_count,
			lake: self.lake || {},
			marina: self.marina || {},
			city: self.city,
			state: self.state,
			insurance_url: insurance_url,
			insurance_file_name: self.insurance_file_name,
			title: self.title,
			description: self.description,
			sub_activities: new_sub_activities,
			pro_hopper: self.pro_hopper,
			activities: {
				fishing: self.fishing,
				leisure: self.leisure,
				watersports: self.watersports,
				celebrity: self.celebrity,
				celebrity_requested: self.celebrity_requested,
			},
			features: self.features,
            extra_features: self.extra_features,
			navigation: self.navigation,
            extra_navigation: self.extra_navigation,
			rules: self.rules,
            extra_rules: self.extra_rules,
			guests_should_bring: self.guests_should_bring,
			price: self.price,
			time_increments: self.time_increments,
			first_guests_discount: self.first_guests_discount,
			cancellation_policy: self.cancellation_policy,
			rental: rental ? 1 : 0,
			cover_photo: cover_photo_url,
			preview_photo_1: preview_photo_1_url,
			preview_photo_2: preview_photo_2_url,
            misc_photos: misc_photo_urls,
			dates: date_index,
            available_weekends: self.user.available_weekends,
            available_weekdays: self.user.available_weekdays,
            weekday_start: self.user.weekday_start,
            weekday_end: self.user.weekday_end,
            weekend_start: self.user.weekend_start,
            weekend_end: self.user.weekend_end,
            security_deposit_amount: self.security_deposit_amount,
            user: self.user.to_index_res,
            public: public?,
            monthly_earnings: monthly_earnings,
            total_earnings: total_earnings,
            review_meta: review_meta,
            reviews: review_index,
            bookmarked: bbs.include?(self.id),
            locations: location_index,
            marinas: marina_index,
            custom_cancellation_policy: self.custom_cancellation_policy,
            filet_package: self.filet_package,
            media_package: self.media_package,
            filet_package_price: self.filet_package_price,
            media_package_price: self.media_package_price,
		}
	end

	def public?
		self.public && !self.force_private
	end

	def new_sub_activities
		{
			fishing: {
	            bass: self.bass,
	            crappie: self.crappie,
	            walleye: self.walleye,
	            trout: self.trout,
	            catfish: self.catfish,
	            striper: self.striper,
	            bow: self.bow,
	        },
	        leisure: {
            	tubing: self.tubing,
	            swimming: self.swimming,
	            floating: self.floating,
	            cruising: self.cruising,
	            sunset_cruise: self.sunset_cruise,
	            special_moments: self.special_moments,
	            bachelor: self.bachelor,
	        },
	        watersports: {
	            wake_surfing: self.wake_surfing,
	            wakeboarding: self.wakeboarding,
	            foiling: self.foiling,
	            skiing: self.skiing,
	        },
	        celebrity_requested: {
	        	celebrity_watersports: self.celebrity_watersports,
	        	celebrity_fishing: self.celebrity_fishing,
	        },
	        celebrity: {
	        	celebrity_watersports: self.celebrity_watersports,
	        	celebrity_fishing: self.celebrity_fishing,
	        },
		}
	end

	def location_index(where={})
		boat_locations.where(where).map do |location|
			location.to_index_res
		end
	end

	def marina_index
		marinas.where(approved: true).map do |marina|
			marina.to_index_res
		end
	end

	def bookings_index
		bookings.where.not(status: ['unconfirmed', 'payment_required']).map do |booking|
			booking.to_index_res
		end
	end

	def insurance_url
		insurance.service_url if insurance.attachment
	end

	def cover_photo_url
		cover_photo.variant(resize_to_limit: [700, 700]).processed.service_url if cover_photo.attachment && cover_photo.variable?
	end

	def preview_photo_1_url
		preview_photo_1.variant(resize_to_limit: [700, 700]).processed.service_url if preview_photo_1.attachment && preview_photo_1.variable?
	end

	def preview_photo_2_url
		preview_photo_2.variant(resize_to_limit: [700, 700]).processed.service_url if preview_photo_2.attachment && preview_photo_2.variable?
	end

    def misc_photo_urls
    	misc_photos = []
    	misc_photos.push(misc_photo_1.variant(resize_to_limit: [700, 700]).processed.service_url) if misc_photo_1.attachment && misc_photo_1.variable?
       	misc_photos.push(misc_photo_2.variant(resize_to_limit: [700, 700]).processed.service_url) if misc_photo_2.attachment && misc_photo_2.variable?
       	misc_photos.push(misc_photo_3.variant(resize_to_limit: [700, 700]).processed.service_url) if misc_photo_3.attachment && misc_photo_3.variable?
       	misc_photos.push(misc_photo_4.variant(resize_to_limit: [700, 700]).processed.service_url) if misc_photo_4.attachment && misc_photo_4.variable?
       	misc_photos.push(misc_photo_5.variant(resize_to_limit: [700, 700]).processed.service_url) if misc_photo_5.attachment && misc_photo_5.variable?
       	misc_photos.push(misc_photo_6.variant(resize_to_limit: [700, 700]).processed.service_url) if misc_photo_6.attachment && misc_photo_6.variable?
       	misc_photos
    end

	def date_index
		BoatDate.where(user: self.user_id).map do |date|
			date.date&.strftime("%B %e, %Y")
		end
	end

	def update_locations!(marinas)
		boat_locations.destroy_all
		marinas.each do |marina_id|
			BoatLocation.create(
				boat_id: self.id,
				marina_id: marina_id,
			)
		end
	end

	def lake
		marina&.lake
	end

	def state
		marina&.state
	end

	def country
		marina&.country
	end

	def monthly_earnings
		bookings.from_this_month.where(status: 'completed').sum(:amount)
	end

	def total_earnings
		bookings.where(status: 'completed').sum(:amount)
	end

	def review_meta
		res = ActiveRecord::Base.connection.execute("SELECT AVG(reviews.rating), COUNT(reviews.rating) FROM reviews WHERE reviews.host = false AND reviews.booking_id IN (SELECT bookings.id FROM bookings WHERE bookings.boat_id = '#{self.id}')").first
		{
			rating: res["avg"].to_f.round(2).to_s,
			count: res["count"],
		}
	end

	def review_index
		Review.where(booking: bookings, host: false).map do |review|
			review.to_res
		end
	end

	def send_question(guest:, question:)
		QuestionMailer.send(
			boat: self,
			guest: guest,
			question: question
		)
	end

	def send_insurance_email!
		InsuranceMailer.send(
			blob: self.insurance.blob,
			name: user.full_name
		)
	end

	def time_ranges_on_date(date)
		date = Date.parse(date.to_s)
		is_weekend = date.saturday? || date.sunday?
		times = is_weekend ? [*self.user.weekend_start..self.user.weekend_end] : [*self.user.weekday_start..self.user.weekday_end]
		bks = bookings.where(status: 'approved').where("date::date = '#{date}'")

		nt = bks.reduce(times) do |times, booking|
			bt = [*booking.start_time..booking.end_time]
			times.reject! do |time|
				bt.include?(time)
			end

			i = times.find_index do |time|
				time && time > booking.end_time
			end
			times.insert(i, nil) if i
			times
		end
		nt = nt.split(nil)
		time_increments.reduce({}) do |mem, (key, bool)|
			if bool
				mem[key] = []
				nt.each do |range|
					li = range.length - 1
					range.each_with_index do |n, i|
						mem[key].push(n) if li - key.to_i >= i
					end
				end
			end
			mem
		end
	end

	def self.partition_sort(params)
		params.reduce([{}, {}]) do |mem, (k,v)|
			a, b = k.to_s.split('.')
			if a === 'sort_by'
				mem[1][b] = v
			else
				mem[0][a] = v
			end
			mem
		end
	end

	def self.sort_boats(query, sort_by)
		sort_by.reduce(query) do |q, (k, v)|
			if v === 'DESC' || v === 'ASC'
				case k
				when 'price'
					q = q.order(price: v)
				when 'rating'
					q = q.select('boats.*, AVG(reviews.rating)').left_joins(:bookings).joins('LEFT OUTER JOIN reviews ON reviews.booking_id = bookings.id').group('boats.id').order("AVG(reviews.rating) #{v}")
				when 'guest_count'
					q = q.order(guest_count: v)
				when 'trip_count'
					q = q.select('boats.*, COUNT(bookings.id)').left_joins(:bookings).group('boats.id').order("COUNT(bookings.id) #{v}")
				end
			end
			q
		end
	end

	def self.search(params, current_user=nil, offset=0)
		date = params[:date] == 'null' ? nil : params[:date]
		params.delete(:date)

		min_price = params[:min_price] == '' ? nil : params[:min_price]
		params.delete(:min_price)

		max_price = params[:max_price] == '' ? nil : params[:max_price]
		params.delete(:max_price)

		guest_count = params[:guest_count]
		params.delete(:guest_count)

		lake_id = params[:lake_id]
		params.delete(:lake_id)

		params[:boat_type] = params[:boat_type].split(',') if params[:boat_type]

		params[:public] = true
		params[:force_private] = false

		if date
			dobj = Date.parse(date)
			is_weekend = dobj.saturday? || dobj.sunday?
			if is_weekend
				hosts = User.where(available_weekends: true)
			else
				hosts = User.where(available_weekdays: true)
			end
		end

		if params[:min_lat]
			m = m.where("lat <= :max_lat AND lat >= :min_lat AND lng <= :max_lng AND lng >= :min_lng", params)
			params.delete(:min_lat)
			params.delete(:max_lat)
			params.delete(:min_lng)
			params.delete(:max_lng)
		end

		params, sort_by = partition_sort(params)


		query = sort_boats(Boat.where(params), sort_by)

		query = query.where("boats.pro_hopper = false OR (boats.pro_hopper = true AND boats.pro_hopper = true AND boats.pro_hopper_approved = true)")

		if min_price
			query = query.where("price >= ?", min_price)
		end

		if max_price
			query = query.where("price <= ?", max_price)
		end

		if guest_count
			query = query.where("guest_count >= #{guest_count}")
		end

		if date
			query = query.where(user: hosts).where("boats.id NOT IN (SELECT boats.id FROM boats WHERE (boats.pro_hopper = false AND boats.user_id IN (SELECT boat_dates.user_id FROM boat_dates WHERE date = '#{date}')) OR (boats.pro_hopper = true AND boats.user_id IN (SELECT pro_hopper_dates.user_id FROM pro_hopper_dates WHERE date = '#{date}')))")
		end

		bbs = current_user&.bookmarked_boats&.pluck(:id) || []

		if lake_id
			m = Marina.where(approved: true)
			m = m.where(lake_id: lake_id)
				 .or(m.where(state_id: lake_id))
				 .or(m.where(country_id: lake_id))
			query = query.where(boat_locations: BoatLocation.where(marina: m))
		end

		query.order(id: :desc).offset(offset).limit(20).references(:marinas).map do |boat|
			boat.to_search_index(bbs)
		end
	end

    def self.index(offset=0, limit=nil, term=nil)

		if term
			boats = self.search_by_host(term)
		else
			boats = Boat.all
		end

		if limit
			boats = boats.order(created_at: :desc).offset(offset).limit(limit)
		end
	
	    boats.map do |boat|
	        boat.to_index_res
	    end
    end

    def self.celebrity_index
    	Boat.where(celebrity: true).or(Boat.where(celebrity_requested: true)).map do |boat|
    		{
				id: boat.user.id,
				boat_id: boat.id,
			    name: boat.user.full_name,
			    title: boat.title,
			    email: boat.user.email,
			    created: boat.created_at.to_date,
			    celebrity: boat.celebrity,
			    celebrity_requested: boat.celebrity_requested,
    		}
    	end
    end

end
