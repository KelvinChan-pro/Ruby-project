namespace :locations do
	desc 'create new sub activities'
	task create: :environment do
		Boat.all.each do |boat|
			if boat.marina
				BoatLocation.create!(
					boat: boat,
					marina: boat.marina,
				)
			end
		end
	end

	task add_to_bookings: :environment do
		Booking.all.each do |booking|
			booking.marina = booking.boat.marina
			booking.save!
		end
	end
end