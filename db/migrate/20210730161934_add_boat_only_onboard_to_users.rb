class AddBoatOnlyOnboardToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :boat_only_onboard, :boolean, default: false
  end
end
