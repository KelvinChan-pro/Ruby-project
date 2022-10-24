class AddCancellationPolicyToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :cancellation_policy, :string
  end
end
