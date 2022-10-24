class AddNewBoolsToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :available_weekends, :boolean, default: false
    add_column :boats, :available_weekdays, :boolean, default: false
  end
end
