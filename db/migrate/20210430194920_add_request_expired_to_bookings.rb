class AddRequestExpiredToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :request_expired, :boolean, default: false
  end
end
