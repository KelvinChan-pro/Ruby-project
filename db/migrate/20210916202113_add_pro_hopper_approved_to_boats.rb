class AddProHopperApprovedToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :pro_hopper_approved, :boolean, default: false
  end
end
