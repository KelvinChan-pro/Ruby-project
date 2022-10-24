class AddSubActivityColsToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :tubing, :boolean, default: false
    add_column :boats, :swimming, :boolean, default: false
    add_column :boats, :floating, :boolean, default: false
    add_column :boats, :cruising, :boolean, default: false
    add_column :boats, :sunset_cruise, :boolean, default: false
    add_column :boats, :special_moments, :boolean, default: false
    add_column :boats, :wake_surfing, :boolean, default: false
    add_column :boats, :wakeboarding, :boolean, default: false
    add_column :boats, :foiling, :boolean, default: false
    add_column :boats, :skiing, :boolean, default: false
    add_column :boats, :bass, :boolean, default: false
    add_column :boats, :crappie, :boolean, default: false
    add_column :boats, :walleye, :boolean, default: false
    add_column :boats, :trout, :boolean, default: false
    add_column :boats, :catfish, :boolean, default: false
    add_column :boats, :striper, :boolean, default: false
    add_column :boats, :bow, :boolean, default: false
  end
end
