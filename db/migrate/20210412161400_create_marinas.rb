class CreateMarinas < ActiveRecord::Migration[6.0]
  def change
    create_table :marinas, id: :uuid do |t|
      t.string :name
      t.string :address
      t.string :city
      t.string :state
      t.float :lat
      t.float :lng
      t.references :lake, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
