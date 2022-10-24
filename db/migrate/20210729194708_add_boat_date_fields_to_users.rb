class AddBoatDateFieldsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :weekday_start, :integer
    add_column :users, :weekday_end, :integer
    add_column :users, :weekend_start, :integer
    add_column :users, :weekend_end, :integer
    add_column :users, :available_weekends, :boolean, default: false
    add_column :users, :available_weekdays, :boolean, default: false
  end
end
