class AddColsToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :fishing, :boolean, default: false
    add_column :boats, :cruising, :boolean, default: false
    add_column :boats, :watersports, :boolean, default: false
    add_column :boats, :resources, :text
  end
end
