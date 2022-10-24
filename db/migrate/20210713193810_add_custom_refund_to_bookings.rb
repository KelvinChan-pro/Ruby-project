class AddCustomRefundToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :custom_refund, :integer
  end
end
