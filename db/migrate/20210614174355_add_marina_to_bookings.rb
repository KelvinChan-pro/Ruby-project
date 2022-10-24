class AddMarinaToBookings < ActiveRecord::Migration[6.0]
  def change
    add_reference :bookings, :marina, null: true, foreign_key: true, type: :uuid
  end
end
