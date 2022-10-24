class AddNumberToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :number, :integer
  end
end
