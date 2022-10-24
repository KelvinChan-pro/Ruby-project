class Booking < ApplicationRecord
	include Moneyable
	include Times
	belongs_to :user
	belongs_to :boat
	belongs_to :marina, required: false
	has_one :guest_location, dependent: :destroy
	accepts_nested_attributes_for :guest_location
	has_one :guest_boat, dependent: :destroy
	accepts_nested_attributes_for :guest_boat
	has_many :events, class_name: 'BookingEvent', dependent: :destroy
	validates :duration_in_hours, :date, presence: true
	validates :marina_id, presence: true, if: :not_pro_hopper?
	validates :start_time, :goal_for_trip, presence: true, if: :not_unconfirmed?
	validates :number_of_guests, presence: true, if: :not_pro_hopper_and_not_unconfirmed?
	after_create :set_number
	after_create :set_amount
	after_create :create_payment_intent
	scope :from_this_month, lambda { where("bookings.date > ? AND bookings.date < ?", Time.now.beginning_of_month, Time.now.end_of_month) }

	STATUSES = %w(unconfirmed payment_required requested approved declined cancelled_by_guest cancelled_by_host completed cancellation_requested).freeze

	def update_status!(status)
		if self.status === status
			puts "Booking is already on status: #{status}"
			return
		end

		if !STATUSES.include?(status)
			raise "Invalid status: #{status}"
		end

		self.status = status
		handle_status_update(status)
		self.save!
		send_emails(status)
		send_host_texts(status) if host.can_text?
		send_guest_texts(status) if guest.can_text?
	end

	def pro_hopper?
		self.boat.pro_hopper
	end

	def not_pro_hopper?
		!pro_hopper?
	end

	def pro_hopper_and_not_unconfirmed?
		pro_hopper? && not_unconfirmed?
	end

	def not_pro_hopper_and_not_unconfirmed?
		not_pro_hopper? && not_unconfirmed?
	end

	def unconfirmed?
		self.status === 'unconfirmed'
	end

	def not_unconfirmed?
		self.status != 'unconfirmed'
	end

	def payment_required?
		self.status === 'payment_required'
	end

	def requested?
		self.status === 'requested'
	end

	def approved?
		self.status === 'approved'
	end

	def declined?
		self.status === 'declined'
	end

	def cancelled_by_host?
		self.status === 'cancelled_by_host'
	end

	def cancelled_by_guest?
		self.status === 'cancelled_by_guest'
	end

	def cancelled?
		cancelled_by_host? || cancelled_by_guest?
	end

	def host
		self.boat.user
	end

	def guest
		self.user
	end

	def location
		self.marina || self.guest_location
	end

	def to_index_res
		{
			id: self.id,
			date: month_date_year,
			status: self.status,
			start_time: self.start_time,
			duration_in_hours: self.duration_in_hours,
			submitted: self.created_at.strftime("%B %e, %Y"),
			amount: amount,
			host_amount: host_amount,
			number_of_guests: self.number_of_guests,
			boat: {
				title: self.boat.title,
				cover_photo: self.boat.cover_photo_url,
			},
			user: {
				full_name: self.user.full_name,
				profile_picture: self.user.profile_picture_url,
			},
			calendar_link: calendar_link,
		}
	end

	def to_show_res
		{
			id: self.id,
			date: self.date,
			date_string: self.date.strftime("%m/%d/%Y"),
			duration_in_hours: self.duration_in_hours,
			start_time: self.start_time,
			number_of_guests: self.number_of_guests,
			goal_for_trip: self.goal_for_trip,
			status: self.status,
			boat: boat.to_show_res,
			user: user.to_index_res,
			host: host.to_index_res,
			client_secret: payment_intent.client_secret,
			payment_status: payment_intent.status,
			host_events: host_event_index,
			guest_events: guest_event_index,
			amount: amount,
			amount_with_service_fee: amount_with_service_fee,
			service_fee: service_fee,
			listing_fee: listing_fee,
			host_amount: host_amount,
			security_deposit: security_deposit_amount,
			security_deposit_date: security_deposit_date_string,
			security_deposit_time: security_deposit_time,
			days_until_start: days_until_start,
			hours_until_start: hours_until_start,
			refund_amount: refund_amount,
			marina: location&.to_index_res,
			calendar_link: calendar_link,
			filet_package: self.filet_package,
			media_package: self.media_package,
			discount_code: self.discount_code,
			discount_amount: self.discount_amount,
		}
	end

	def days_until_start
		(Date.parse(self.date.to_s) - Date.today).to_i
	end

	def hours_until_start
		((self.date.to_time - Time.now) / 1.hours).to_i
	end

	def set_amount
		self.amount = self.boat.price * self.duration_in_hours + (self.filet_package ? boat.filet_package_price : 0) + (self.media_package ? boat.media_package_price : 0)
	end

	def service_fee
		(amount * 0.10).to_i
	end

	def amount_with_service_fee
		if self.discount_amount
			(amount - self.discount_amount + service_fee).to_i
		else
			(amount + service_fee).to_i
		end
	end

	def listing_fee
		(amount * 0.15).to_i
	end

	def host_amount
		(amount - listing_fee).to_i
	end

	def create_security_deposit!
		self.events.find_or_create_by(
			title: 'Security Deposit Placed',
			description: "The security deposit hold for this trip (total #{security_deposit_string}) has been placed. This hold will be removed 48 hours after the trip is complete.",
			host_event: false,
		)
		self.events.find_or_create_by(
			title: 'Security Deposit Placed',
			description: "The security deposit hold for this trip (total #{security_deposit_string}) has been placed. This hold will be removed 48 hours after the trip is complete.",
			host_event: true,
		)

		md = metadata
		md[:security_deposit] = true

		spi = Stripe::PaymentIntent.create({
			amount: stripeify(security_deposit_amount),
			currency: 'usd',
			capture_method: 'manual',
			customer: self.user.stripe_customer_id,
			payment_method: self.user.payment_id,
			confirm: true,
			off_session: true,
			metadata: md,
		})

		self.security_deposit_payment_intent_id = spi.id
		self.save

		RemoveSecurityDeposit.set(wait_until: end_datetime + 2.days).perform_later(self.id)
	end

	def remove_security_deposit!
		Stripe::PaymentIntent.cancel(
		  self.security_deposit_payment_intent_id,
		)
	end

	def security_deposit_amount
		self.boat.security_deposit_amount
	end

	def security_deposit_date
		(self.date - 2.day)
	end

	def security_deposit_time
		(self.date - 2.day).to_time
	end

	def security_deposit_date_string
		(self.date - 2.day).strftime("%B %e, %Y")
	end

	def security_deposit_string
		to_usd(security_deposit_amount)
	end

	def end_datetime
		self.date + self.duration_in_hours.hours
	end

	def expire_request!
		if self.requested?
			self.request_expired = true
			update_status!('declined')
		end
	end

	def payment_intent
		Stripe::PaymentIntent.retrieve(self.stripe_payment_intent_id)
	end

	def charge
		payment_intent.charges.first
	end

	def metadata
		{
			id: self.id,
			number: self.number,
			guest_id: self.user.id,
			boat_id: self.boat.id,
			duration_in_hours: self.duration_in_hours,
			boat_price: to_usd(self.boat.price),
			host_full_name: self.host.full_name,
			guest_full_name: self.guest.full_name,
			trip_date: month_date_year, 
			amount: to_usd(self.amount),
			listing_fee: to_usd(listing_fee),
			host_amount: to_usd(host_amount),
			service_fee: to_usd(service_fee),
			security_deposit: to_usd(security_deposit_amount),
			security_deposit_date: security_deposit_date_string,
			amount_with_service_fee: to_usd(amount_with_service_fee),
			start_time: start_time_string, 
			end_time: end_time_string, 
			number_of_guests: self.number_of_guests,
			discount_code: self.discount_code,
			discount_amount: self.discount_amount,
		}
	end

	def create_payment_intent
		spi = Stripe::PaymentIntent.create({
			amount: stripeify(amount_with_service_fee),
			currency: 'usd',
			capture_method: 'manual',
			customer: self.user.stripe_customer_id,
			setup_future_usage: 'off_session',
			metadata: metadata,
			transfer_group: self.id,
		})
		self.stripe_payment_intent_id = spi.id
		self.save
	end

	def capture_payment_intent
		Stripe::PaymentIntent.capture(self.stripe_payment_intent_id)
	end

	def cancel_payment_intent
		Stripe::PaymentIntent.cancel(self.stripe_payment_intent_id)
	end

	def host_kickback
		self.amount * AmbassadorProfile::HOST_COMP
	end

	def guest_kickback
		self.amount * AmbassadorProfile::GUEST_COMP
	end

	def transfer_to_ambassador
		# first scenario: guest and host have the same ambassador
		if guest.ambassador && host.ambassador && guest.ambassador == host.ambassador
			create_transfer(
				amount: host_kickback + guest_kickback,
				destination: guest.ambassador.user.stripe_account_id,
			)
		elsif guest.ambassador
			create_transfer(
				amount: guest_kickback,
				destination: guest.ambassador.user.stripe_account_id,
			)
		elsif host.ambassador
			create_transfer(
				amount: host_kickback,
				destination: host.ambassador.user.stripe_account_id,
			)
		end
	end

	def transfer_to_host(half_transfer: false, amount: nil)
		amount ||= half_transfer ? half_host_amount : host_amount
		transfer = create_transfer(
			amount: amount,
			destination: host.stripe_account_id,
		)
		self.stripe_transfer_id = transfer.id
	end

	def create_transfer(amount:, destination:)
		Stripe::Transfer.create({
			amount: stripeify(amount),
			currency: 'usd',
			destination: destination,
			transfer_group: self.id,
			source_transaction: self.discount_amount.to_f > 0 ? nil : charge.id, # don't source transaction if discount code is present (payment diff is covered by LH stripe balance)
			metadata: metadata,
		})
	end

	def half_host_amount
		(host_amount / 2).to_i
	end

	def half_refund?
		cancelled_by_guest? && hours_until_start < 24
	end

	def refund_amount
		# refund full amount if host cancelled or 24 hours before start 
	    # else refund half of it
	    if half_refund?
	    	(half_amount + service_fee).to_i
	    else
	    	amount_with_service_fee
	    end
	end

	def half_amount
		(amount / 2).to_i
	end

	def refund(amount: nil)
		if amount
			self.custom_refund = amount
		else
			amount = refund_amount
		end
		amount ||= refund_amount
		if amount > 0
			refund = Stripe::Refund.create({
				payment_intent: self.stripe_payment_intent_id,
				metadata: metadata,
				amount: stripeify(amount)
			})
			self.stripe_refund_id = refund.id
		end
	end

	def check_for_discount
		discount = Discount.find_by(code: self.discount_code)
		if discount
			a = 0
			if discount.dollar_amount
				a = discount.amount
			else
				a = amount * discount.percentage
			end
			if self.discount_amount != a
				self.discount_amount = a
				self.save
				create_payment_intent
			end
		end
	end

	def send_tip(amount)
		md = metadata
		md[:tip] = true
		tpi = Stripe::PaymentIntent.create({
			amount: stripeify(amount),
			currency: 'usd',
			customer: self.user.stripe_customer_id,
			payment_method: self.user.payment_id,
			confirm: true,
			off_session: true,
			stripe_account: self.host.stripe_account_id,
			metadata: md,
		})
	end

	def host_event_index
		self.events.where(host_event: true).order(created_at: :desc).map do |event|
			{
				timestamp: event.created_at,
				title: event.title,
				description: event.description,
				action: event.action,
			}
		end
	end

	def guest_event_index
		self.events.where(host_event: false).order(created_at: :desc).map do |event|
			{
				timestamp: event.created_at,
				title: event.title,
				description: event.description,
				action: event.action,
			}
		end
	end

	def guest_name
		self.user.first_name
	end

	def host_name
		self.boat.user.first_name
	end

	def host_review
		r = Review.find_by(booking: self, host: true)
		r&.to_res
	end

	def host_review_exists?
		Review.find_by(booking: self, host: true).present?
	end

	def guest_review
		r = Review.find_by(booking: self, host: false)
		r&.to_res
	end

	def guest_review_exists?
		Review.find_by(booking: self, host: false).present?
	end

	def month_date_year
		self.date.strftime("%B %e, %Y")
	end

	def set_end_time
		self.end_time = self.start_time + self.duration_in_hours
	end

	def start_time_string
		TIMES[self.start_time] if self.start_time
	end

	def end_time_string
		TIMES[self.start_time + self.duration_in_hours] if self.start_time
	end

	def message(hosting, message, reply=false)
		recevier = hosting ? guest : host
		sender = hosting ? host : guest
		params = {
			message: message,
			sender_name: sender.first_name,
			receiver_name: recevier.first_name,
			reply_url: ENV['DOMAIN'] + '/bookings/' + self.id + "/reply?type=#{hosting ? 'guest' : 'host'}",
			subject_type: hosting ? 'Host' : 'Guest',
			body_type: hosting ? 'host' : 'guest',
		}

		send_email(
			email: recevier.email,
			template: "booking-#{reply ? 'reply' : 'message'}",
			type: hosting ? 'guest' : 'host',
			custom_params: params,
		)

		if recevier.can_text?
			send_text(
				to: recevier.phone_number,
				template: "booking-#{reply ? 'reply' : 'message'}",
				type: hosting ? 'guest' : 'host',
				custom_params: params,
			)
		end
	end

	def calendar_time_stamp(time)
		time.strftime("%Y%m%dT%H%M%SZ")
	end

	def calendar_link
		"https://calendar.google.com/calendar/u/0/r/eventedit?text=Lake Hop Trip&dates=#{calendar_time_stamp(self.date)}/#{calendar_time_stamp(end_datetime)}&details=#{calendar_details}&location=#{location&.full_address}"
	end

	def calendar_details
		"Trip with #{host.full_name} at #{location&.full_name}."
	end

	def send_email(email:, template:, type: nil, path: nil, custom_params: {})
		BookingMailer.send(
			email: email, 
			template: template,
			params: email_params.merge(custom_params),
			type: type,
			path: path,
		)
	end

	private

	def time_stamp(date)
		"<span data-time=#{date}></span>"
	end

	def date_stamp(date)
		"<span data-date=#{date}></span>"
	end

	def ensure_time_range_does_not_overlap
		ranges = boat.time_ranges_on_date(self.date)
		if self.start_time && !ranges[self.duration_in_hours.to_s].include?(self.start_time)
			raise "Time range overlaps with an existing booking."
		end
	end

	def create_jobs(new_status)
		case new_status
		when 'requested'
			set_end_time
			# decline booking 24 hours after request or 1 hour before trip start time if no response from host
			one_hour_before = self.date - 1.hour
			in_one_day = DateTime.now + 1.day
			wait_until = one_hour_before < in_one_day ? one_hour_before : in_one_day
			DeclineBooking.set(wait_until: wait_until).perform_later(self.id)
			RemindHost.set(wait: 6.hours).perform_later(self.id)
		when 'declined'
			cancel_payment_intent
		when 'approved'
			ensure_time_range_does_not_overlap
			# capture payment hold
			capture_payment_intent
			# create security deposite hold 24 hours before trip start if not a pro hopper
			unless self.boat.pro_hopper
				SecurityDeposit.set(wait_until: security_deposit_time).perform_later(self.id)
			end
			# update booking status to completed on trip end time
			CompleteBooking.set(wait_until: end_datetime).perform_later(self.id)
		when 'cancelled_by_host'
			refund
		when 'cancelled_by_guest'
			if self.custom_refund
				transfer_to_host(amount: host_amount - self.custom_refund)
			else
				refund
				transfer_to_host(half_transfer: true) if half_refund?
			end
		when 'completed'
			transfer_to_host
			transfer_to_ambassador
		end
	end

	def create_events(new_status)
		now = DateTime.now.strftime('%Q')
		tomorrow = (DateTime.now + 1.day).strftime('%Q')
		booking_date = self.date.strftime('%Q')

		case new_status
		when 'requested'
			self.events.find_or_create_by(
				title: 'Booking Request Received!',
				description: "You submitted a booking request on #{date_stamp(now)}, #{time_stamp(now)}. You can expect a response from the host, #{host_name}, within 24 hours.<br/><br/>We will send you a response when it is available.",
				host_event: false,
			)

			self.events.find_or_create_by(
				title: 'Booking Request Received!',
				description: "#{guest_name} submitted a booking request on #{date_stamp(now)}, #{time_stamp(now)}. You can review the details on the left and choose to either approve or decline the booking request.<br/><br/>If you don’t respond by #{date_stamp(tomorrow)}, #{time_stamp(now)}, the request will be automatically declined.",
				action: 'approve',
				host_event: true,
			)
		when 'approved'
			self.events.find_or_create_by(
				title: 'Booking Approved',
				description: "You approved #{guest_name}’s booking on #{date_stamp(now)}, #{time_stamp(now)}.<br/>We’ve sent over the full booking details, including what to bring and a review of the boat rules to #{guest_name}. The next step is just to hit the waters on #{month_date_year}!",
				host_event: true,
			)

			self.events.find_or_create_by(
				title: 'Booking Approved',
				description: "#{host_name} approved your booking on #{date_stamp(now)}, #{time_stamp(now)}.<br/>We’ve sent over the full booking details, including what to bring and a review of the boat rules. The next step is just to hit the waters on #{month_date_year}!",
				host_event: false,
			)
		when 'declined'
			self.events.find_or_create_by(
				title: 'Booking Declined',
				description: "You declined #{guest_name}'s booking on #{date_stamp(now)}, #{time_stamp(now)}. #{!!self.decline_message ? "Your message below was sent as well:<br/><br/>#{self.decline_message}" : ''}",
				host_event: true,
			)

			self.events.find_or_create_by(
				title: 'Booking Declined',
				description: "#{host_name} declined your booking request on #{date_stamp(now)}, #{time_stamp(now)}. #{!!self.decline_message ? "They provided the following reason for declining:<br/><br/>#{self.decline_message}" : ''}",
				host_event: false,
			)
		when 'cancelled_by_host'
			self.events.find_or_create_by(
				title: 'Booking Cancelled',
				description: "You and your guest have been sent email confirmation of the cancellation.",
				host_event: true,
			)

			self.events.find_or_create_by(
				title: 'Booking Cancelled',
				description: "#{host_name} cancelled this booking on #{date_stamp(now)}.",
				host_event: false,
			)
		when 'cancelled_by_guest'
			self.events.find_or_create_by(
				title: 'Booking Cancelled',
				description: "#{guest_name} cancelled this booking on #{date_stamp(now)}.",
				host_event: true,
			)
			self.events.find_or_create_by(
				title: 'Booking Cancelled',
				description: "You cancelled this booking on #{date_stamp(now)}.",
				host_event: false,
			)
		when 'cancellation_requested'
			self.events.find_or_create_by(
				title: 'Cancellation Requested',
				description: "You requested this booking on #{date_stamp(now)}. You should receive a refund, if applicable, within 24 hours.",
				host_event: false,
			)
		end
	end

	def email_params
		{
			host_first_name: self.host.first_name,
			host_full_name: self.host.full_name,
			host_headline: self.host.headline,
			guest_first_name: self.guest.first_name,
			guest_full_name: self.guest.full_name,
			guest_profile_picture: self.guest.profile_picture_url,
			host_profile_picture: self.host.profile_picture_url,  
			id: self.id, 
			number: self.number, 
			date: month_date_year, 
			amount: to_usd(self.amount),
			listing_fee: to_usd(listing_fee),
			host_amount: to_usd(host_amount),
			half_host_amount: half_host_amount, 
			service_fee: to_usd(service_fee),
			security_deposit: to_usd(security_deposit_amount),
			security_deposit_date: security_deposit_date_string,
			amount_with_service_fee: to_usd(amount_with_service_fee),
			duration: self.duration_in_hours, 
			start_time: start_time_string, 
			end_time: end_time_string, 
			number_of_guests: self.number_of_guests,
			cancel_message: self.cancel_message,
			decline_message: self.decline_message,
			lake: location.lake_name,
		}
	end

	def send_emails(new_status)
		case new_status
		when 'requested'
			send_email(
				email: host.email, 
				template:'booking-request-host',
				type: 'host',
			)
			send_email(
				email: guest.email, 
				template: 'booking-request-guest',
				type: 'guest',
			)
		when 'approved'
			send_email(
				email: guest.email, 
				template: 'booking-approved',
				type: 'guest',
			)
		when 'declined'
			send_email(
				email: guest.email, 
				template: 'booking-declined',
				type: 'guest',
			)
		when 'cancelled_by_host'
			send_email(
				email: host.email, 
				template:'booking-cancelled-by-host-host',
				type: 'host',
			)
			send_email(
				email: guest.email, 
				template:'booking-cancelled-by-host-guest',
				type: 'guest',
			)
		when 'cancelled_by_guest'
			send_email(
				email: host.email, 
				template:"booking-cancelled-by-guest-host#{half_refund? ? '-half' : ''}",
				type: 'host',
			)
			send_email(
				email: guest.email, 
				template:'booking-cancelled-by-guest-guest',
				type: 'guest',
			)
		when 'completed'
			send_email(
				email: host.email, 
				template:'booking-completed-host',
				type: 'host',
			)
			send_email(
				email: guest.email, 
				template:'booking-completed-guest',
				type: 'guest',
			)
		when 'cancellation_requested'
			send_email(
				email: 'support@golakehop.com', 
				template:'booking-cancellation-requested',
				path: "/cancel_booking/#{self.id}",
			)
		end
	end

	def send_text(to:, template:, type:, custom_params: {})
		TwilioService.send(
			to: to, 
			template: template,
			type: type,
			params: email_params.merge(custom_params),
		)
	end

	def send_host_texts(status)
		case status
		when 'requested'
			send_text(
				to: host.phone_number, 
				template:'booking-request-host',
				type: 'host',
			)
		when 'cancelled_by_host'
			send_text(
				to: host.phone_number, 
				template:'booking-cancelled-by-host-host',
				type: 'host',
			)
		when 'cancelled_by_guest'
			send_text(
				to: host.phone_number, 
				template:'booking-cancelled-by-guest-host',
				type: 'host',
			)
		when 'completed'
			send_text(
				to: host.phone_number, 
				template:'booking-completed-host',
				type: 'host',
			)
		end
	end

	def send_guest_texts(status)
		case status
		when 'requested'
			send_text(
				to: guest.phone_number, 
				template: 'booking-request-guest',
				type: 'guest',
			)
		when 'approved'
			send_text(
				to: guest.phone_number, 
				template: 'booking-approved',
				type: 'guest',
			)
		when 'declined'
			send_text(
				to: guest.phone_number, 
				template: 'booking-declined',
				type: 'guest',
			)
		when 'cancelled_by_host'
			send_text(
				to: guest.phone_number, 
				template:'booking-cancelled-by-host-guest',
				type: 'guest',
			)
		when 'cancelled_by_guest'
			send_text(
				to: guest.phone_number, 
				template:'booking-cancelled-by-guest-guest',
				type: 'guest',
			)
		when 'completed'
			send_text(
				to: guest.phone_number, 
				template:'booking-completed-guest',
				type: 'guest',
			)
		end
	end

	def handle_status_update(new_status)
		create_jobs(new_status)
		create_events(new_status)
	end

	def stripeify(n=0)
		(n * 100).to_i
	end

	def set_number
		self.number = 1000 + Booking.count
		self.save
	end
end
