class AddProHopperToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :pro_hopper_onboard, :boolean, default: false
  end
end
