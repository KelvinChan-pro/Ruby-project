class AddPackageColsToBookings < ActiveRecord::Migration[6.0]
  def change
    add_column :bookings, :media_package, :boolean, default: false
    add_column :bookings, :filet_package, :boolean, default: false
  end
end
