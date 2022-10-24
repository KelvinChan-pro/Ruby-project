class AddFieldsToBoat < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :length, :integer
    add_column :boats, :guest_count, :integer
  end
end
