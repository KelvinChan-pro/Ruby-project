class RemoveLakesFromBoatLocations < ActiveRecord::Migration[6.0]
  def change
  	remove_column :boat_locations, :lake_id, :uuid
  end
end
