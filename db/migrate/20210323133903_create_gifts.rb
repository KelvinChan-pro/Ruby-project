class CreateGifts < ActiveRecord::Migration[6.0]
  def change
    create_table :gifts, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :gift_type
      t.string :size
      t.string :address
      t.string :city
      t.string :state

      t.timestamps
    end
  end
end
