class AddNnewColsToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :filet_package, :boolean, default: false
    add_column :boats, :media_package, :boolean, default: false
    add_column :boats, :filet_package_price, :integer, default: 0
    add_column :boats, :media_package_price, :integer, default: 0
  end
end
