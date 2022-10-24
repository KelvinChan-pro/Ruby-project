class AddColsToBookingEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :booking_events, :host_event, :boolean
    add_column :booking_events, :action, :string
  end
end
