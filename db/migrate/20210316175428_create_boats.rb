class CreateBoats < ActiveRecord::Migration[6.0]
  def change
    create_table :boats, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :boat_type
      t.string :make
      t.string :model
      t.string :year

      t.timestamps
    end
  end
end
