class AddCustomCancellationPolicyToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :custom_cancellation_policy, :text
  end
end
