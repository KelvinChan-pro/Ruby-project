class RenameDiscountPercentageOnBookings < ActiveRecord::Migration[6.0]
  def change
  	add_column :bookings, :discount_amount, :integer, default: 0 
  end
end
