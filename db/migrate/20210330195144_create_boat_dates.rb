class CreateBoatDates < ActiveRecord::Migration[6.0]
  def change
    create_table :boat_dates, id: :uuid do |t|
      t.references :boat, null: false, foreign_key: true, type: :uuid
      t.date :date

      t.timestamps
    end
  end
end
