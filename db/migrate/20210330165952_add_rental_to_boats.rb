class AddRentalToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :rental, :boolean, default: false
  end
end
