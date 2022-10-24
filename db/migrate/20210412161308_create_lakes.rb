class CreateLakes < ActiveRecord::Migration[6.0]
  def change
    create_table :lakes, id: :uuid do |t|
      t.float :lat
      t.float :lng
      t.float :zoom
      t.string :name

      t.timestamps
    end
  end
end
