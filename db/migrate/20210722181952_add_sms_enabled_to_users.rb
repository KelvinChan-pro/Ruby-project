class AddSmsEnabledToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :sms_enabled, :boolean, default: false
  end
end
