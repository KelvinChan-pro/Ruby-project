class CreateGuestLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :guest_locations, id: :uuid do |t|
      t.string :address
      t.string :lake_name
      t.string :city
      t.string :state
      t.string :zip
      t.references :booking, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
