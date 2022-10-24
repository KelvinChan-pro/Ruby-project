class AddCelebrityToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :celebrity, :boolean, default: false
    add_column :boats, :celebrity_requested, :boolean, default: false
  end
end
