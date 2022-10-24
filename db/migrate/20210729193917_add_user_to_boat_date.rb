class AddUserToBoatDate < ActiveRecord::Migration[6.0]
  def change
    add_reference :boat_dates, :user, null: true, foreign_key: true, type: :uuid
  end
end
