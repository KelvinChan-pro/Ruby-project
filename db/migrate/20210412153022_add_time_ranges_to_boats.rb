class AddTimeRangesToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :weekday_start, :integer
    add_column :boats, :weekday_end, :integer
    add_column :boats, :weekend_start, :integer
    add_column :boats, :weekend_end, :integer
  end
end
