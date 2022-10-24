class CreateGuestBoats < ActiveRecord::Migration[6.0]
  def change
    create_table :guest_boats, id: :uuid do |t|
      t.string :boat_type
      t.string :year
      t.string :make
      t.string :model
      t.string :length
      t.references :booking, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
