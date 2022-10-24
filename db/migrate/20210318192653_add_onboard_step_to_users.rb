class AddOnboardStepToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :onboard_step, :integer, default: 0
    add_column :users, :onboard_sub_step, :integer, default: 0
    add_column :users, :onboard_metadata, :text
  end
end
