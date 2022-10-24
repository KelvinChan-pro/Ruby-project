class RemoveLatFromBoats < ActiveRecord::Migration[6.0]
  def change
    remove_column :boats, :latitude, :float
    remove_column :boats, :longitude, :float
  end
end
