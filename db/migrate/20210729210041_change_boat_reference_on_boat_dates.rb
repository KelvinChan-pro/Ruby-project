class ChangeBoatReferenceOnBoatDates < ActiveRecord::Migration[6.0]
  def up
    change_column_null :boat_dates, :boat_id, true
  end

  def down
    change_column_null :boat_dates, :boat_id, false
  end
end
