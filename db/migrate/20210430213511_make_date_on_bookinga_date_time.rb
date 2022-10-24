class MakeDateOnBookingaDateTime < ActiveRecord::Migration[6.0]
  def change
  	change_column :bookings, :date, :datetime
  end
end
