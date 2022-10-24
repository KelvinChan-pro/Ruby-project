class ChangeSmsEnabled < ActiveRecord::Migration[6.0]
  def change
  	change_column :users, :sms_enabled, :boolean, default: true
  end
end
