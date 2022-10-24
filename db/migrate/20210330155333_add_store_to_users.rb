class AddStoreToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :story, :text
  end
end
