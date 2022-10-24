class AddOldIdToLakes < ActiveRecord::Migration[6.0]
  def change
    add_column :lakes, :old_id, :string
  end
end
