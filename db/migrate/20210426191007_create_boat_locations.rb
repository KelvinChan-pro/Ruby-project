class CreateBoatLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :boat_locations, id: :uuid do |t|
      t.references :boat, null: false, foreign_key: true, type: :uuid
      t.references :lake, null: false, foreign_key: true, type: :uuid
      t.references :marina, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
