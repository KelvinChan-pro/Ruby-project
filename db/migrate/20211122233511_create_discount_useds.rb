class CreateDiscountUseds < ActiveRecord::Migration[6.0]
  def change
    create_table :discount_useds, id: :uuid do |t|
      t.references :user, type: :uuid
      t.references :discount, type: :uuid

      t.timestamps
    end
  end
end
