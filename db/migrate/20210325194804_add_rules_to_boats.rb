class AddRulesToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :rules, :text
  end
end
