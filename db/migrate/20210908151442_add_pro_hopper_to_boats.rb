class AddProHopperToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :pro_hopper, :boolean, default: false
  end
end
