class AddGuestsShouldBringToBoats < ActiveRecord::Migration[6.0]
  def change
    add_column :boats, :guests_should_bring, :text
  end
end
