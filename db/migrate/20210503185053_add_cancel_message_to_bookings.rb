class AddCancelMessageToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :cancel_message, :text
  end
end
