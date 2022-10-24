class RemindHost < ApplicationJob
	queue_as :default

	def perform(id)
		booking = Booking.find(id)

		if booking.requested?
			booking.send_email(
				email: booking.host.email,
				template: 'booking-request-host-reminder',
				type: 'host',
			)

			RemindHost.set(wait: 6.hours).perform_later(id)
		end
	end
end
