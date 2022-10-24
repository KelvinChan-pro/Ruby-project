class RemoveMarinaIdFromBoats < ActiveRecord::Migration[6.0]
  def change
  	remove_column :boats, :marina_id, :uuid
  end
end
