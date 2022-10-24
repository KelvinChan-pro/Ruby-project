class AddDiscountRowsToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :discount_code, :string
    add_column :bookings, :discount_percentage, :float
  end
end
