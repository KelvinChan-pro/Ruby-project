class CreateBookingEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :booking_events, id: :uuid do |t|
      t.text :description
      t.string :title
      t.references :booking, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
