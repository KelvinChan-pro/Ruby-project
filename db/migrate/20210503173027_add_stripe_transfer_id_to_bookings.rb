class AddStripeTransferIdToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :stripe_transfer_id, :string
  end
end
