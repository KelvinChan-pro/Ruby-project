class AddDeclineMessageToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :decline_message, :text
  end
end
