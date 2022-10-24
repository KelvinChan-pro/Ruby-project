class CreateBookings < ActiveRecord::Migration[6.0]
  def change
    create_table :bookings, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :boat, null: false, foreign_key: true, type: :uuid
      t.date :date
      t.integer :duration_in_hours
      t.integer :start_time
      t.integer :number_of_guests
      t.text :goal_for_trip
      t.string :stripe_payment_intent_id
      t.string :status, default: 'unconfirmed'

      t.timestamps
    end
  end
end
