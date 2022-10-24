class CreateDiscounts < ActiveRecord::Migration[6.0]
  def change
    create_table :discounts, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.float :percentage
      t.string :code

      t.timestamps
    end
  end
end
