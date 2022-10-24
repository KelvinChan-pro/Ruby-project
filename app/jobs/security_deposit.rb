class SecurityDeposit < ApplicationJob
	queue_as :default

	def perform(booking_id)
		booking = Booking.find(booking_id)
		booking.create_security_deposit!
	end
end
