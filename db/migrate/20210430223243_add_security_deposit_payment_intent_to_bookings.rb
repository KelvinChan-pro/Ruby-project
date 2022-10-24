class AddSecurityDepositPaymentIntentToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :security_deposit_payment_intent_id, :string
  end
end
