class AddExtraColumnsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :date_of_birth, :date
    add_column :users, :address, :string
    add_column :users, :address_two, :string
    add_column :users, :city, :string
    add_column :users, :state, :string
    add_column :users, :zip, :string
    add_column :users, :ssn, :string
  end
end
