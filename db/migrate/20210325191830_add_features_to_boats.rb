class AddFeaturesToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :features, :text
    add_column :boats, :navigation, :text
  end
end
