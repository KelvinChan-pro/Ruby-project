class AddStripeRefundIdToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :stripe_refund_id, :string
  end
end
