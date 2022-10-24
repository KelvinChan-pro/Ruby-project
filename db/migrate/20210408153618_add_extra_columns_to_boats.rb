class AddExtraColumnsToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :extra_features, :text
    add_column :boats, :extra_navigation, :text
    add_column :boats, :extra_rules, :text
  end
end
