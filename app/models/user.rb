class User < ApplicationRecord
	include PgSearch::Model
	pg_search_scope :search_by_name, against: [:first_name, :last_name], using: {
	                                                tsearch: { 
	                                                    prefix: true 
	                                                }
	                                            }
	include ActiveStorageSupport::SupportForBase64
	validates :email, :password_digest, :first_name, :last_name, presence: true
	validates :email, uniqueness: true
	has_many :password_resets, dependent: :destroy
	has_many :boats, dependent: :destroy
	has_one :gift, dependent: :destroy
	has_many :bookings, dependent: :destroy
	has_many :host_bookings, through: :boats, source: 'bookings'
	has_many :bookmarks, dependent: :destroy
	has_many :bookmarked_boats, through: :bookmarks, source: :boat
	has_many :marinas, dependent: :destroy
	has_one :ambassador_profile
	has_many :boat_dates, dependent: :destroy
	has_many :pro_hopper_dates, dependent: :destroy
	belongs_to :ambassador, class_name: 'AmbassadorProfile', foreign_key: 'ambassador_profile_id', required: false
	has_one_base64_attached :profile_picture
	serialize :onboard_metadata, Hash
	has_secure_password
	after_create :send_confirmation_email
	after_create :create_stripe_account
	after_create :create_stripe_customer

    def to_index_res
        {
        	id: self.id,
        	first_name: self.first_name,
        	full_name: full_name,
        	review_name: self.first_name + ' ' + self.last_name[0],
            name: full_name,
            email: self.email,
            profile_picture_url: profile_picture_url,
            story: self.story,
            headline: self.headline,
            created: self.created_at.to_date,
            hear_about_us: self.hear_about_us,
            type: self.host ? 'Host' : 'Guest',
            is_ambassador:  ambassador?,
        }
    end

    def to_profile_res
    	{
    		id: self.id,
    		profile_picture_url: profile_picture_url,
    		year_joined: self.created_at.year,
    		first_name: self.first_name,
    		email_confirmed: self.email_confirmed,
    		payouts_enabled: payouts_enabled,
    		story: self.story,
            headline: self.headline,
            boats: boats.map { |b| b.to_search_index },
            review_meta: review_meta,
            reviews: review_index,
            dates: date_index,
            pro_hopper_dates: pro_hopper_date_index,
            available_weekends: self.available_weekends,
            available_weekdays: self.available_weekdays,
            weekday_start: self.weekday_start,
            weekday_end: self.weekday_end,
            weekend_start: self.weekend_start,
            weekend_end: self.weekend_end,
    	}
    end

	def to_res
		{
			id: self.id,
            admin: admin?,
            ambassador: ambassador?,
            host: self.host,
            pro_hopper_onboard: self.pro_hopper_onboard,
            has_pro_hopper: self.boats.find_by(pro_hopper: true).present?,
			year_joined: self.created_at.year,
			full_name: full_name,
			first_name: self.first_name,
			last_name: self.last_name,
			email: self.email,
			sms_enabled: self.sms_enabled,
			requires_onboarding: requires_onboarding && !self.onboard_completed,
			boat_only_onboard: self.boat_only_onboard,
			phone_number: self.phone_number,
			email_confirmed: self.email_confirmed,
			profile_picture_url: profile_picture_url,
			onboard_step: self.onboard_step,
			onboard_sub_step: self.onboard_sub_step,
			onboard_metadata: self.onboard_metadata,
			stripe_link: stripe_link,
			payouts_enabled: payouts_enabled,
			gift: gift&.to_res,
			story: self.story,
            headline: self.headline,
            license_number: self.license_number,
            date_of_birth: self.date_of_birth,
            address: self.address,
            address_two: self.address_two,
            city: self.city,
            state: self.state,
            zip: self.zip,
            ssn: self.ssn,
            full_address: self.full_address,
            payment_methods: payment_cards,
            host_review_meta: host_review_meta,
            host_reviews: host_review_index,
            monthly_earnings: monthly_earnings,
            total_earnings: total_earnings,
            dates: date_index,
            pro_hopper_dates: pro_hopper_date_index,
            available_weekends: self.available_weekends,
            available_weekdays: self.available_weekdays,
            weekday_start: self.weekday_start,
            weekday_end: self.weekday_end,
            weekend_start: self.weekend_start,
            weekend_end: self.weekend_end,
		}
	end

	def date_index
		BoatDate.where(user_id: self.id).map do |date|
			date.date&.strftime("%B %e, %Y")
		end
	end

	def update_dates(dates)
		boat_dates.destroy_all
		dates.each do |date|
			BoatDate.create!(
				user: self,
				date: date
			)
		end
	end

	def pro_hopper_date_index
		ProHopperDate.where(user_id: self.id).map do |date|
			date.date&.strftime("%B %e, %Y")
		end
	end

	def update_pro_hopper_dates(dates)
		pro_hopper_dates.destroy_all
		dates.each do |date|
			ProHopperDate.create!(
				user: self,
				date: date
			)
		end
	end

	def boat_index
		boats.map do |boat|
			boat.to_show_res
		end
	end

    def full_name
        self.first_name + ' ' + self.last_name
    end

	def profile_picture_url
	    self.profile_picture.variant(resize_to_limit: [300, 300]).processed.service_url if self.profile_picture.attachment
	end

	def bookmark_index
		bookmarked_boats.map do |boat|
			boat.to_search_index
		end
	end

	def intercom_hmac
		OpenSSL::HMAC.hexdigest(
		  'sha256',
		  ENV["INTERCOM_SECRET"],
		  self.id
		)
	end

	def ambassador?
		!!self.ambassador_profile
	end

	def requires_onboarding
		self.host
	end

	def onboard_meta_data
		{
			step: self.onboard_step,

		}
	end

	def review_meta
		res = ActiveRecord::Base.connection.execute("SELECT AVG(reviews.rating), COUNT(reviews.rating) FROM reviews WHERE reviews.host = true AND reviews.booking_id IN (SELECT bookings.id FROM bookings WHERE bookings.user_id = '#{self.id}')").first
		{
			rating: res["avg"].to_f.round(2).to_s,
			count: res["count"],
		}
	end

	def review_index
		Review.where(booking: bookings, host: true).map do |review|
			review.to_res
		end
	end

	def host_review_meta
		res = ActiveRecord::Base.connection.execute("SELECT AVG(reviews.rating), COUNT(reviews.rating) FROM reviews WHERE reviews.host = false AND reviews.booking_id IN (SELECT bookings.id FROM bookings WHERE bookings.boat_id IN (SELECT boats.id FROM boats WHERE boats.user_id = '#{self.id}'))").first
		{
			rating: res["avg"].to_f.round(2).to_s,
			count: res["count"],
		}
	end

	def host_review_index
		Review.where(booking: host_bookings, host: false).map do |review|
			review.to_res
		end
	end

	def monthly_earnings
		host_bookings.from_this_month.where(status: 'completed').sum(:amount)
	end

	def total_earnings
		host_bookings.where(status: 'completed').sum(:amount)
	end


	def bookings_index
		bookings.where.not(status: ['unconfirmed', 'payment_required']).map do |booking|
			booking.to_index_res
		end
	end

	def host_bookings_index
		host_bookings.where.not(status: ['unconfirmed', 'payment_required']).map do |booking|
			booking.to_index_res
		end
	end

	def create_stripe_account
		account = Stripe::Account.create({
  			type: 'custom',
		  	country: 'US',
		  	business_type: 'individual',
		  	individual: {
		  		first_name: self.first_name,
		  		last_name: self.last_name,
		  		email: self.email,
		  	},
		  	email: self.email,
		  	capabilities: {
		    	card_payments: {requested: true},
		    	transfers: {requested: true},
		  	},
		  	business_profile: {
		  		mcc: '4457',
		  		product_description: 'Hosting my boat on a ridesharing and rental platform.',
		  		url: 'https://www.golakehop.com',
		  	},
		})
		self.stripe_account_id = account.id
		self.save
	end

	def update_stripe_account
		Stripe::Account.update(self.stripe_account_id, {
			individual: {
				first_name: self.first_name,
				last_name: self.last_name,
				id_number: self.ssn,
				phone: self.phone_number,
				address: {
					city: self.city,
					state: self.state,
					postal_code: self.zip,
					line1: self.address,
					line2: self.address_two,
					country: 'US',
				},
				dob: {
					day: self.date_of_birth&.day,
					month: self.date_of_birth&.month,
					year: self.date_of_birth&.year,
				}
			},
			email: self.email,
		})

		Stripe::Customer.update(self.stripe_customer_id, {
			email: self.email,
			name: self.full_name,
			phone: self.phone_number,
			address: {
				city: self.city,
				state: self.state,
				postal_code: self.zip,
				line1: self.address,
				line2: self.address_two,
				country: 'US',
			},
		})
	end

	def stripe_account
		Stripe::Account.retrieve(self.stripe_account_id) if self.stripe_account_id
	end

	def attach_external_account!(token)
		Stripe::Account.create_external_account(
		  self.stripe_account_id,
		  {
		  	external_account: token,
		  	default_for_currency: true,
		  },
		)
	end

	def payouts_enabled
		stripe_account&.payouts_enabled
	end

	def fields_needed
		fields = stripe_account.requirements.currently_due
		!(fields.length == 0 || fields == ["external_account"])
	end

	def stripe_link
		if self.host && fields_needed
			account_link = Stripe::AccountLink.create({
			  	account: self.stripe_account_id,
				refresh_url: ENV['DOMAIN'] + '/api/v1/users/' + self.id + '/refresh',
				return_url: ENV['DOMAIN'] + '/onboarding',
				type: 'account_onboarding',
				collect: 'eventually_due',
			})
			account_link.url
		end
	end

	def send_confirmation_email
		token = Token.create(metadata: { user_id: self.id })
		VerifyEmailMailer.send(
			email: self.email,
			name: self.first_name,
			token: token.key,
			account_type: 'Guest',
		)
	end

	def create_stripe_customer
		customer = Stripe::Customer.create({
			email: self.email,
			name: self.full_name,
			phone: self.phone_number,
			address: {
				city: self.city,
				state: self.state,
				postal_code: self.zip,
				line1: self.address,
				line2: self.address_two,
				country: 'US',
			},
		})
		self.stripe_customer_id = customer.id
		self.save
	end

	def stripe_customer
		Stripe::Customer.retrieve(self.stripe_customer_id)
	end

	def payment_methods
		Stripe::PaymentMethod.list({
			customer: self.stripe_customer_id,
			type: 'card',
		})
	end

	def payment_cards
		payment_methods.data
	end

	def payment_id
		payment_methods.first&.id
	end

	def background_check(signature)
		response = DocSpringClient.generate_pdf(
			template_id: "tpl_HzLjXZf766QrELP95t",
			test: Rails.env != 'production',
			data: {
				date: Date.today.strftime("%m/%d/%Y"),
				name: self.full_name,
				email: self.email,
				signature: {
					base64: signature.split(",")[1],
				}
		  	},
		)
		file = open(response.submission.download_url)
		pdf = Base64.encode64(file.read)
		BackgroundCheckMailer.send(
			name: self.full_name,
			pdf: pdf,
		)
	end

	def set_onboard_reminder(key)
		destroy_onboard_reminders
		OnboardReminder.set(wait: 2.hours).perform_later(self.id, key)
	end

	def destroy_onboard_reminders
		Sidekiq::ScheduledSet.new.each do |job|
			if job.args[0] && job.args[0]["job_class"] === "OnboardReminder" && job.args[0]["arguments"][0] === self.id
				job.delete
			end
		end
	end

	def can_text?
		self.sms_enabled && self.phone_number
	end

    def admin?
        self.admin
    end

    def full_address
       "#{self.address || ''} #{self.address_two || ''} #{self.city || ''} #{self.state || ''} #{self.zip || ''}"
    end

    def self.index(offset=0, limit=nil, term=nil)
    	if term
    		users = self.search_by_name(term)
    	else
    		users = User.all
    	end

    	if limit
    		users = users.order(created_at: :desc).offset(offset).limit(limit)
    	end
  
        users.map do |user|
            user.to_index_res
        end
    end

    def self.pro_hopper_index
    	User.where(boats: Boat.where(pro_hopper: true)).map do |user|
    		{
				id: user.id,
				boat_id: user.boats.first.id,
			    name: user.full_name,
			    email: user.email,
			    created: user.created_at.to_date,
			    pro_hopper_approved: user.boats.find_by(pro_hopper: true)&.pro_hopper_approved,
    		}
    	end
    end
end
