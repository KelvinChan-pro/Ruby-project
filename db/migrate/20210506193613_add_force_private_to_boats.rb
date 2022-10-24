class AddForcePrivateToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :force_private, :boolean, default: false
  end
end
