class AddPublicToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :public, :boolean, default: false
  end
end
