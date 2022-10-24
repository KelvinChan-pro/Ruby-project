class AddEvenMoreColsToBoat < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :price, :float
    add_column :boats, :time_increments, :text
    add_column :boats, :first_guests_discount, :boolean, default: false
  end
end
