class DeclineBooking < ApplicationJob
	queue_as :default

	def perform(booking_id)
		booking = Booking.find(booking_id)
		booking.expire_request!
	end
end
