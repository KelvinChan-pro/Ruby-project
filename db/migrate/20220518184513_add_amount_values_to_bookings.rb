class AddAmountValuesToBookings < ActiveRecord::Migration[6.0]
  def change
  	Booking.all.each do |booking|
  		booking.set_amount
  		booking.save
  	end
  end
end
