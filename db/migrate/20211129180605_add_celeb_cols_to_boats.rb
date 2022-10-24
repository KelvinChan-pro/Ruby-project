class AddCelebColsToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :celebrity_watersports, :boolean, default: false
    add_column :boats, :celebrity_fishing, :boolean, default: false
  end
end
