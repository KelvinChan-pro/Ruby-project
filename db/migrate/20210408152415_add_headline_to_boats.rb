class AddHeadlineToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :headline, :string
    add_column :users, :license_number, :string
  end
end
