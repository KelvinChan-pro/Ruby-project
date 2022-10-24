class AddHostBoolToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :host, :boolean, default: false
  end
end
