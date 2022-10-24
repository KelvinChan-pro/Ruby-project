class AddMoreFieldsToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :lake, :string
    add_column :boats, :marina, :string
    add_column :boats, :city, :string
    add_column :boats, :state, :string
  end
end
