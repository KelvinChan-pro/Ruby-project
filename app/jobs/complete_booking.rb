class CompleteBooking < ApplicationJob
	queue_as :default

	def perform(booking_id)
		booking = Booking.find(booking_id)
		if !booking.cancelled?
			booking.update_status!('completed')
		end
	end
end
