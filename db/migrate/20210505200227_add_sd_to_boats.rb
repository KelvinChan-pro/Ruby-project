class AddSdToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :security_deposit_amount, :integer
  end
end
