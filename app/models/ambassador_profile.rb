class AmbassadorProfile < ApplicationRecord
	GUEST_COMP = 0.02 # TODO: get actual comp values
	HOST_COMP = 0.03

	belongs_to :user
	has_many :users
	after_create :set_uid

	def guests
		users
	end

	def hosts
		users.where(host: true)
	end

	def guest_bookings
		Booking.where(user: guests)
	end

	def host_bookings
		Booking.where(boat: Boat.where(user: hosts))
	end

	def sum_bookings(bookings)
		bookings.sum(:amount)
	end

	def to_show_res
		{
			id: self.user_id,
			uid: self.uid,
			user_id: self.user_id,
			email: self.user.email,
			name: self.user.full_name,
			host_count: hosts.count,
			guest_count: guests.count,
			guest_bookings_sum: sum_bookings(guest_bookings) * GUEST_COMP,
			host_bookings_sum: sum_bookings(host_bookings) * HOST_COMP,
			booking_count: (guest_bookings + host_bookings).count,
			guest_link: ENV['DOMAIN'] + "?ambassador=#{self.uid}",
			host_link: ENV['DOMAIN'] + "/share-your-boat?ambassador=#{self.uid}",
		}
	end

	def set_uid
		last = self.id.split('-')[-1]
		self.uid = last
		self.save
	end

	def self.index
		AmbassadorProfile.all.map do |ap|
			ap.to_show_res
		end
	end
end
