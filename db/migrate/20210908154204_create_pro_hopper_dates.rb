class CreateProHopperDates < ActiveRecord::Migration[6.0]
  def change
    create_table :pro_hopper_dates, id: :uuid do |t|
      t.date :date
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
